import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect, Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import JSZip from "jszip";

import UploadSpec from "./UploadSpec";
import { nodeTypes, type CustomNodeType } from "./nodes";
import { edgeTypes, type CustomEdgeType } from "./edges";
import {verifyConnection, newBigraphNodeConfig, newStoreNodeConfig, randomPosition} from "../connect";
import {
  exportComposition,
  validateUpload,
  uploadComposition, FlowRepresentation, compileFlow, compileComposition, writeComposition
} from "../io";
import {
  initialNodes,
  initialEdges,
} from "../examples";
import {
  BigraphNodeData,
  StoreNodeData,
  FlowNodeConfig,
  StoreNode,
  FormattedBigraphNode,
  FormattedComposition,
} from "../datamodel";

import { VivariumService } from "../services/VivariumService";
import { BigraphNode } from "./nodes/BigraphNode";
import {PortCallbackContext} from "../PortCallbackContext";
// TODO: create method which takes in only spec.json and infers edges/block-specific data from the input/output ports!
// TODO: create button which dynamically adds new nodes to the initialNodes array
// TODO: change block table elements to be string <inputs> that are dynamically created if not using the registry9

let nObjects: number = 0;

export default function App() {
  // hooks
  const [projectName, setProjectName] = useState<string>('My Composition');
  const [stores, setStores] = useState<StoreNodeData[]>([]);
  const [bigraphNodes, setBigraphNodes] = useState<BigraphNodeData[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);
  const nodeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  let numNodes = nodes.length;
  let numObjects = 0;
  
  // vivarium builder (stateful)
  const vivarium = new VivariumService();
  
  //const portCallbackMap = new Map<string, (nodeId: string, portType: string, portName: string) => void>();
  const portCallbackMap = useRef(new Map<string, (nodeId: string, portType: string, portName: string) => void>());
  
  // Function to register a new node's callback
  const registerPortCallback = (nodeId: string) => {
    console.log(`🗂️ Registering handlePortAdded for ${nodeId}`);
    portCallbackMap.current.set(nodeId, handlePortAdded);
  };
  
  const handlePortAdded = (nodeId: string, portType: string, portName: string) => {
    console.log(`New port of type: ${portType} added to node ${nodeId}: ${portName}`);
    
    // now, add a new store node, as you are recieving a stream of updates from the child.
    const storeNodeId = portName;
    addStoreNode(storeNodeId, [portName], [nodeId]);
    
    // add an edge between the two
    addEdge(nodeId, storeNodeId);
    
    // addEdge(nodeId, storeNodeId);
    const connection: Connection = {
      source: nodeId,
      target: storeNodeId,
      sourceHandle: null,
      targetHandle: null,
    }
    
    // onConnect(connection);
    
  };
  
  // graph connector
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      console.log(`Connection event: ${JSON.stringify(connection)}`);
  
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
  
  // graph exporter
  const exportComposition = (
    nodes: CustomNodeType[],
    edges: CustomEdgeType[],
    projectName: string,
  ) => {
    // graph exporter
    const flowRepresentation: FlowRepresentation = compileFlow(nodes, edges);
    const compositionSpec: FormattedComposition = compileComposition(nodes);
    const compositionName = projectName.split(" ").join("_").toLowerCase();
    writeComposition(flowRepresentation, compositionSpec, compositionName);
  };
  
  const importComposition = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadComposition(event, (data: FormattedComposition) => {
      console.log("Received data:", data);
      Object.keys(data).forEach(key => {
        // uploaded json file will be a formatted node(without nodeID, ingest-able by process-bigraph
        const uploadedNode: FormattedBigraphNode = data[key];
        
        // convert formatted node to bigraph node data (nodeID)
        const bigraphNode: BigraphNodeData = {
          nodeId: key,
          _type: uploadedNode._type,
          address: uploadedNode.address,
          config: uploadedNode.config,
          inputs: uploadedNode.config,
          outputs: uploadedNode.outputs
        };
        
        // convert bigraph node data node to flow node
        const nodePosition = randomPosition();
        vivarium.addFlowNodeConfig(bigraphNode, nodePosition.x, nodePosition.y, "bigraph-node");
        const newFlowNode = vivarium.getFlowNodeConfig(bigraphNode.nodeId) as CustomNodeType;
        
        // here run set nodes
        console.log(`Recieved uploaded node: ${JSON.stringify(newNode)}`);
        setNodes((existingNodes) => {
          const updatedNodes = [...existingNodes, newNode]; // represents the latest state
          console.log("Updated Nodes:", updatedNodes);
          return updatedNodes;
        });
      });
      
    });
  };
  
  const setNewNode = (newFlowNode: CustomNodeType, newNodeId: string) => {
    // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
    setNodes((existingNodes) => {
      const updatedNodes = [...existingNodes, newFlowNode]; // represents the latest state
      console.log("Updated Nodes:", updatedNodes);
      return updatedNodes;
    });
    
    // link this node id to the port callback listener within the child BigraphNode
    registerPortCallback(newNodeId);
    
    // buffer on blur (possibly remove)
    setTimeout(() => {
      if (nodeRefs.current[newNodeId]) {
        nodeRefs.current[newNodeId]?.focus();
      }}, 50);
  }
  
  // new empty node constructor
  const addEmptyNode = (nodeType: string) => {
    // placeholder nodeId based on existing num nodes
    numNodes += 1;
    const newNodeId = `${nodeType}_${numNodes}`;
    const placeholderAddress = `local:${newNodeId}`;
    const emptyNode: BigraphNodeData = vivarium.newEmptyBigraphNodeData(newNodeId, placeholderAddress, numNodes, nodeType);
    
    // add node to vivarium builder nodes (this also adds the corresponding React-flow node config)
    vivarium.addProcess(emptyNode);
    
    // use flow node indexer to lookup the flow node config for the new node we just created, compat with CustomNodeType (react-flow specific)
    const newFlowNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    
    // this conditional acts as a sanity check, which I need!!!
    if (newFlowNode) {
      // register this node, thereby propagating changes to all children and set with react-flow
      setNewNode(newFlowNode, newNodeId);
    } else {
      console.log("No node found for this node");
    }
  };
  
  // used on buttons:
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
    vivarium.addObject(emptyStore);

    const newFlowNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    if (newFlowNode) {
      // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newFlowNode];
        console.log("Updated Nodes with stores:", updatedNodes);
        return updatedNodes;
      });
      
      // set timeout for blur render TODO: possibly remove this!
      setTimeout(() => {
        if (nodeRefs.current[newNodeId]) {
          nodeRefs.current[newNodeId]?.focus();
        }
      }, 50);
    } else {
      // TODO: change this
      alert("Could not parse a flow node config from this store.")
    }
    console.log(`After store, Now num nodes are: ${numObjects}`);
  };
  
  const addEdge = useCallback(
    (sourceId: string, targetId: string) => {
    const newEdge = vivarium.addFlowEdgeConfig(sourceId, targetId);
    console.log(`New edge: ${JSON.stringify(newEdge)}`);
    setEdges((existingEdges) => {
      const updatedEdges = [...existingEdges, newEdge];
      return updatedEdges;
    });
  }, [setEdges]);
  
  // function for automatically adding a new store node whenever an individual node's port is added or changed
  const addStoreNode = useCallback(
    (newNodeId: string, value: string[], connections: string[]) => {
    const emptyStore = vivarium.newStoreNodeData(newNodeId, value, connections);
    vivarium.addObject(emptyStore);

    const newFlowNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    if (newFlowNode) {
      // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newFlowNode];
        console.log("Updated Nodes with stores:", updatedNodes);
        return updatedNodes;
      });
      
      // set timeout for blur render TODO: possibly remove this!
      setTimeout(() => {
        if (nodeRefs.current[newNodeId]) {
          nodeRefs.current[newNodeId]?.focus();
        }
      }, 50);
    } else {
      // TODO: change this
      alert("Could not parse a flow node config from this store.")
    }
  }, [setNodes]);
  
  // project name setter
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value); // Update state with input value
  };

  return (
    <div className="reactflow-wrapper" style={{ height: "100vh", width: "100vw" }}>
      <div className="project-name">
          <input
            id="inputField"
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            className="border rounded p-2 mt-1 w-full"
            placeholder="Enter project name..."
          />
      </div>
      <PortCallbackContext.Provider value={portCallbackMap.current}>
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
      </PortCallbackContext.Provider>
      
      <div className="buttons-container">
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
      </div>
    </div>
  );
}


// const store: StoreNodeData = {
//   nodeId: newNodeId,
//   value: ["empty_store"],
//   connections: ["None"] as string[]
// }
// const newNode: StoreNode = {
//   id: newNodeId, // Unique ID
//   type: "store-node", // Match the type used in `nodeTypes`
//   position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
//   data: store
// };
