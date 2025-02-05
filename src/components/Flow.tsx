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
import { verifyConnection, newBigraphNodeConfig, newStoreNodeConfig } from "../connect";
import {
  exportComposition,
  validateUpload,
  uploadComposition
} from "../io";
import {
  initialNodes,
  initialEdges,
} from "../examples";
import {
  BigraphNodeData,
  StoreNodeData,
  FlowNodeConfig,
  BigraphNode,
  StoreNode,
  FormattedBigraphNode,
  FormattedComposition,
} from "../datamodel";

import { VivariumService } from "../services/VivariumService";

// TODO: create method which takes in only spec.json and infers edges/block-specific data from the input/output ports!
// TODO: create button which dynamically adds new nodes to the initialNodes array
// TODO: change block table elements to be string <inputs> that are dynamically created if not using the registry

let nObjects: number = 0;

export default function App() {
  // hooks
  const [projectName, setProjectName] = useState<string>('My Composition');
  const [stores, setStores] = useState<StoreNodeData[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);
  const nodeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  let numNodes = nodes.length;
  let numObjects = 0;
  console.log(`Starting with ${numNodes} nodes and ${numObjects} objects`);
  
  // vivarium builder (stateful)
  const vivarium = new VivariumService();

  
  // graph connector
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Call your validation function
      const isValid = verifyConnection(connection);
  
      if (isValid) {
        // Proceed to add the edge if valid
        setEdges((edges) => addEdge(connection, edges));
      } else {
        // Optionally, handle invalid connections (e.g., log or show a message)
        console.log("Invalid connection:", connection);
      }
    },
    [setEdges] // Dependencies
  );

  
  // graph exporter
  const exportComposition = () => {
    const flowRepresentation = {  // translation of process bigraph spec to bio blocks upload
      nodes: nodes.map((node) => ({
        id: node.id,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
      })),
    };
    
    // translate BigraphNodeData (which has nodeId) to formatted node ingest-able by process-bigraph
    const compositionSpec: FormattedComposition = {};
    nodes.forEach((node: CustomNodeType) => {  // CustomNodeType is the base class on which process-bigraph representation of "state" nodes are constructed
      const nodeData = node.data as BigraphNodeData;
      const nodeId = nodeData.nodeId as string;
      compositionSpec[nodeId] = {
        _type: nodeData._type,
        address: nodeData.address,
        config: nodeData.config,
        inputs: nodeData.inputs,
        outputs: nodeData.outputs
      };
    });
    
    // get project name
    const compositeName = projectName.split(" ").join("_").toLowerCase();
    
    const zip = new JSZip();
    zip.file("blocks.json", JSON.stringify(flowRepresentation, null, 2));
    zip.file("bigraph.json", JSON.stringify(compositionSpec, null, 2));
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${compositeName}.zip`;
        link.click();

        URL.revokeObjectURL(link.href);
        alert("Graph and metadata exported as composition.zip!");
    });
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
        vivarium.addFlowNodeConfig(bigraphNode, )
        
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
  
  // new empty node constructor
  const addEmptyNode = (nodeType: string) => {
    // placeholder nodeId based on existing num nodes
    numNodes += 1;
    const newNodeId = `${nodeType}_${numNodes}`; // crypto.randomUUID();
    const placeholderAddress = `local:${newNodeId}`;
    const emptyNode: BigraphNodeData = vivarium.newEmptyBigraphNodeData(newNodeId, placeholderAddress, numNodes, nodeType);
    
    // add node to vivarium builder nodes (this also adds the corresponding React-flow node config)
    vivarium.addProcess(emptyNode);
    
    // use flow node indexer to lookup the flow node config for the new node we just created, compat with CustomNodeType (react-flow specific)
    const newFlowNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    
    // this conditional acts as a sanity check, which I need!!!
    if (newFlowNode) {
      // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newFlowNode]; // represents the latest state
        console.log("Updated Nodes:", updatedNodes);
        return updatedNodes;
      });
      
      // add new store node parameterized by the new node
      
      // set timeout for blur render TODO: possibly remove this!
      setTimeout(() => {
        if (nodeRefs.current[newNodeId]) {
          nodeRefs.current[newNodeId]?.focus();
        }
      }, 50);
    }
    console.log(`Now num nodes are: ${numNodes}`);
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
  
  const addStoreNode = (newNodeId: string, value: string[], connections: string[]) => {
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
    console.log(`After store, Now num nodes are: ${numObjects}`);
  };
  
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
