import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Connection,
  useNodesData,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  BigraphNodeData,
  StoreNodeData,
  FormattedBigraphNode,
  FormattedComposition, FlowNodePosition, FlowNodeConfig,
} from "../datamodel";

import { nodeTypes, type CustomNodeType } from "./nodes";
import { edgeTypes, type CustomEdgeType } from "./edges";

import UploadSpec from "./UploadSpec";
import { VivariumService } from "../services/VivariumService";
import { NewPortCallbackContext, PortChangeCallbackContext } from "../PortCallbackContext";
import {
  validateUpload,
  uploadComposition,
  FlowRepresentation,
  compileFlow,
  compileComposition,
  writeComposition
} from "../io";
import { randomPosition } from "../connect";

// TODO: for adding input or output port, first check if such a store exists, and if so connect that one instead of making new
// TODO: ensure that input/output port additions are actually propagated from BigraphNode child to this parent for export!

export default function App() {
  // hooks
  const [projectName, setProjectName] = useState<string>('My Composition');
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);
  const [bigraphFlowNodes, setBigraphFlowNodes] = useState<Record<string, CustomNodeType>>({});
  const [numNodes, setNumNodes] = useState<number>(0);
  const nodeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  let numObjects = 0;
  const vivarium = new VivariumService();
  
  const portCallbackMap = useRef(new Map<string, (nodeId: string, portType: string, portName: string) => void>());
  
  const registerPortCallback = (nodeId: string) => {
    portCallbackMap.current.set(nodeId, handlePortAdded);
  };
  
  // called when user adds new input/output ports in BigraphNode child(parameterized by the child)
  const handlePortAdded = (nodeId: string, portType: string, portName: string) => {
    // store id should be linked to the port name
    const storeNodeId: string = portName;
    const storeValue: string[] = [portName];
    const connections: string[] = [nodeId];
    
    // generate, register, and render new store node
    addLinkedStore(storeNodeId, storeValue, connections, portType);
    
    // add an edge between the new store node and its corresponding bigraph node
    
    if (portType === "inputs") {
      console.log(`source: ${storeNodeId}, target: ${nodeId} Port name: ${portName}(${portType}), `);
      addEdge(storeNodeId, nodeId);
    } else {
      console.log(`source: ${nodeId}, target: ${storeNodeId} Port name: ${portName}(${portType})`);
      addEdge(nodeId, storeNodeId);
    }
  };
  
  // called when users manually connect edges
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      console.log(`Connection event: ${JSON.stringify(connection)}`);
      console.log(`Connection source: ${connection.source}, connection target: ${connection.target}`);
      console.log(`Connection source handle: ${connection.sourceHandle} Connection target handle: ${connection.targetHandle}`)
      
      // HERE: automatically populate the inputs/outputs of an existing bigraph node if user drags a connection between node port and store port
  
      if (!connection.source || !connection.target) {
        console.error("Invalid connection: missing source or target");
        return;
      }
      
      // Add edge to state
      setEdges((prevEdges) => {
        const newEdge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: "button-edge",
          animated: true
        };
  
        console.log("Adding edge:", newEdge);
        return [...prevEdges, newEdge];
      });
    },
    [setEdges]
  );
  
  // called whenever a new node needs to be added either as a store or process and either from manual creation or upload
  const setNewNode = useCallback((newFlowNode: CustomNodeType, newNodeId: string) => {
    setNodes((existingNodes) => {
      return [...existingNodes, newFlowNode];
    });
    
    setBigraphFlowNodes((existingNodes) => ({
        ...existingNodes,
        [newFlowNode.id]: newFlowNode,
    }));
    
    setNumNodes((existingNumNodes) => {
      return existingNumNodes + 1;
    })
    
    // link this node id to the port callback listener within the child BigraphNode
    registerPortCallback(newNodeId);
    
    // buffer on blur (possibly remove)
    renderTimeout(newNodeId);
  }, [bigraphFlowNodes, setBigraphFlowNodes, setNumNodes]);
  
  
  // -- funcs used when Add new ... buttons are clicked --
  
  const addEmptyNode = (nodeType: string) => {
    const newNodeId = `${nodeType}_${numNodes}`;
    const placeholderAddress = `local:${newNodeId}`;
    
    const emptyNode: BigraphNodeData = vivarium.newEmptyBigraphNodeData(newNodeId, placeholderAddress, numNodes, nodeType);
    const newFlowNode = vivarium.addProcess(emptyNode);
    
    if (newFlowNode) {
      // register this node, thereby propagating changes to all children and set with react-flow
      setNewNode(newFlowNode, newNodeId);
    } else {
      console.log("No node found for this node");
    }
  };
  
  const addEmptyProcessNode = () => {
    return addEmptyNode("process");
  }
  
  const addEmptyStepNode = () => {
    return addEmptyNode("step");
  }
  
  const addEmptyStoreNode = () => {
    const uuid = crypto.randomUUID();
    const newNodeId = `new_data_${uuid.slice(uuid.length - 3, uuid.length)}`;
    
    const emptyStore = vivarium.newEmptyStoreNodeData(newNodeId, numObjects);
    const newFlowNode: CustomNodeType = vivarium.addStore(emptyStore);
    
    if (newFlowNode) {
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newFlowNode];
        return updatedNodes;
      });
      
      renderTimeout(newNodeId);
    } else {
      console.log("Could not parse a flow node config from this store.")
    }
  };
  
  const addEmptyObjectNode = () => {
    const uuid = crypto.randomUUID();
    // const newNodeId = `new_data_${uuid.slice(uuid.length - 3, uuid.length)}`;
    const newNodeId = `object_${numNodes}`
    
    const emptyStore = vivarium.newEmptyObjectNodeData(newNodeId, numObjects);
    const newFlowNode: CustomNodeType = vivarium.addObject(emptyStore);
    
    if (newFlowNode) {
      setNewNode(newFlowNode, newNodeId);
      // setNodes((existingNodes) => {
      //   const updatedNodes = [...existingNodes, newFlowNode];
      //   return updatedNodes;
      // });
    } else {
      console.log("Could not parse a flow node config from this store.")
    }
  };
  
  const addEdge = useCallback((sourceId: string, targetId: string) => {
    const newEdge = vivarium.addFlowEdgeConfig(sourceId, targetId);
    setEdges((existingEdges) => {
      const updatedEdges = [...existingEdges, newEdge];
      return updatedEdges;
    });
  }, [setEdges]);
  
  
  // -- function for automatically adding a new store node whenever an individual node's port is added or changed --
  
  const addLinkedStore = useCallback(
    (newNodeId: string, value: string[], connections: string[], portType: string) => {
      // create corresponding store node parameterized by the linked bigraph node
      const newStoreData = vivarium.newStoreNodeData(newNodeId, value, connections);
      
      vivarium.addStore(newStoreData, portType);
      const newFlowNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
      
      if (newFlowNode) {
        setNewNode(newFlowNode, newNodeId);
        renderTimeout(newNodeId);
      } else {
        // TODO: change this
        alert("Could not parse a flow node config from this store.")
      }
  }, [setNodes]);
  
  const renderTimeout = useCallback((newNodeId: string) => {
    setTimeout(() => {
      if (nodeRefs.current[newNodeId]) {
        nodeRefs.current[newNodeId]?.focus();
      }}, 50);
  }, [nodeRefs]);
  
  // project name setter
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value); // Update state with input value
  };
  
  const exportComposition = useCallback(() => {
    // graph exporter
    const flowRepresentation: FlowRepresentation = compileFlow(nodes, edges);
    const compositionSpec: FormattedComposition = compileComposition(nodes);
    const compositionName = projectName.split(" ").join("_").toLowerCase();
    writeComposition(flowRepresentation, compositionSpec, compositionName);
  }, [nodes, edges, projectName]);

  // called on upload spec
  const importComposition = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadComposition(event, (data: FormattedComposition) => {
      Object.keys(data).forEach(key => {
        // uploaded json file will be a formatted node(without nodeID, ingest-able by process-bigraph
        const uploadedNode: FormattedBigraphNode = data[key];
        
        // convert formatted node to bigraph node data (nodeID)
        const bigraphNode: BigraphNodeData = {
          nodeId: key,
          _type: uploadedNode._type,
          address: uploadedNode.address,
          config: uploadedNode.config,
          inputs: uploadedNode.inputs,
          outputs: uploadedNode.outputs
        };
        
        // convert bigraph node to flow node
        const nodePosition = randomPosition();
        vivarium.addFlowNodeConfig(bigraphNode, nodePosition.x, nodePosition.y, "bigraph-node");
        const newFlowNode = vivarium.getFlowNodeConfig(bigraphNode.nodeId) as CustomNodeType;
        
        // set process node
        setNewNode(newFlowNode, newFlowNode.id);
        
        // add store and wire for each input port
        Object.keys(bigraphNode.inputs).forEach(key => {
          handlePortAdded(bigraphNode.nodeId, "inputs", key);
        })
        
        // add store and wire for each output port
        Object.keys(bigraphNode.outputs).forEach(key => {
          handlePortAdded(bigraphNode.nodeId, "outputs", key);
        })
      });
      
    });
  };
  
  const onPortValueChanged = useCallback((nodeId: string, portType: string, portName: string, newValue: string) => {
    // first sync the node values
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === portName) {
          return {
            ...node,
            id: newValue,
            data: {
              ...node.data,
              nodeId: newValue,
              value: [newValue],
              connections: [nodeId]
            },
          };
        }
        return node;
      })
    );
    
    renderTimeout(nodeId);
    
    // then set edges with updated ids
    const source = portType === "inputs" ? newValue : nodeId;
    const target = portType === "inputs" ? nodeId : newValue;
    addEdge(source, target);
  }, [setNodes, addEdge]);
  
  // uncomment and implement below for persistent logic listening on nodes and edges
  // useEffect(() => {
  //   nodes.forEach((node) => {
  //     console.log(`Current node: ${JSON.stringify(node)}`);
  //   })
  // }, [nodes, edges]);
  
  return (
    <div className="reactflow-wrapper">
      <div className="project-name">
          <input
            id="inputField"
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            placeholder="Enter project name..."
          />
      </div>
      <PortChangeCallbackContext.Provider value={onPortValueChanged}>
        <NewPortCallbackContext.Provider value={portCallbackMap.current}>
          <ReactFlow<CustomNodeType, CustomEdgeType>
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            defaultViewport={{ zoom: 1, x: 200, y: 200}}
            // fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </NewPortCallbackContext.Provider>
      </PortChangeCallbackContext.Provider>
      
      <div className="page-header">
        <UploadSpec onLoadGraph={importComposition}/>
        <button
          onClick={exportComposition}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "10px 16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export to JSON
        </button>
        <button
          onClick={addEmptyProcessNode}
          style={{
            position: "absolute",
            top: 0,
            //right: 10,
            left: 190,
            padding: "10.5px 16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add new process
        </button>
        <button
          onClick={addEmptyStepNode}
          style={{
            position: "absolute",
            top: 0,
            //right: 10,
            left: 350,
            padding: "10.5px 16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add new step
        </button>
        <button
          onClick={addEmptyStoreNode}
          style={{
            position: "absolute",
            top: 0,
            //right: 10,
            left: 500,
            padding: "10.5px 16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add new store
        </button>
        <button
          onClick={addEmptyObjectNode}
          style={{
            position: "absolute",
            top: 0,
            //right: 10,
            left: 700,
            padding: "10.5px 16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add new object
        </button>
      </div>
    </div>
  );
}
