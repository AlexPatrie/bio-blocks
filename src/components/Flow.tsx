import React, {useCallback, useEffect, useState} from "react";
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

export default function App() {
  // hooks
  const [inputValue, setInputValue] = useState<string>('My Composition');
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);
  let numNodes = nodes.length;
  console.log(`Starting with ${numNodes} nodes`);
  
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
    
    // const compositionSpec: FormattedComposition = {};
    // nodes.forEach((node: CustomNodeType) => {  // CustomNodeType is the base class on which process-bigraph representation of "state" nodes are constructed
    //   // base type
    //   const nodeData = node.data as BigraphNodeData;
    //   const nodeId = nodeData.nodeId as string;
    //   compositionSpec[nodeId] = {
    //     _type: nodeData._type,
    //     address: nodeData.address,
    //     config: nodeData.config,
    //     inputs: nodeData.inputs,
    //     outputs: nodeData.outputs
    //   };
    // });
    
    vivarium.compile();
    const compositionSpec = vivarium.composite;
    
    // get project name
    const projectName = inputValue.split(" ").join("_").toLowerCase();
    
    const zip = new JSZip();
    zip.file("blocks.json", JSON.stringify(flowRepresentation, null, 2));
    zip.file("bigraph.json", JSON.stringify(compositionSpec, null, 2));
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${projectName}.zip`;
        link.click();

        URL.revokeObjectURL(link.href);
        alert("Graph and metadata exported as composition.zip!");
    });
  };
  
  const importComposition = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse the uploaded composition file
    const uploadedComposition: FormattedComposition = uploadComposition(event) as FormattedComposition;
  
    if (uploadedComposition) {
      // Create nodes from the uploaded composition
      const newNodes = Object.keys(uploadedComposition).map((nodeName: string) => {
        const uploadedNode: FormattedBigraphNode = uploadedComposition[nodeName];
  
        return {
          id: nodeName, // Unique ID from the composition
          type: "bigraph-node", // Node type
          position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
          data: {
            nodeId: nodeName,
            _type: uploadedNode._type,
            address: uploadedNode.address,
            config: uploadedNode.config,
            inputs: uploadedNode.inputs,
            outputs: uploadedNode.outputs,
          },
        } as BigraphNode;
      });
  
      // Update the nodes state
      setNodes((existingNodes) => [...existingNodes, ...newNodes]);
    }
  }, [setNodes]);
  
  // new node constructor
  const addNewProcessNode = () => {
    // placeholder nodeId based on existing num nodes
    numNodes += 1;
    const newNodeId = `process_${numNodes}`; // crypto.randomUUID();
    
    // add node to vivarium builder state
    vivarium.addProcess(newNodeId, `local:${newNodeId}`);
    const newNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    
    // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
    if (newNode) {  // acts as a sanity check
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newNode]; // represents the latest state
        console.log("Updated Nodes:", updatedNodes);
        return updatedNodes;
      });
    }
    console.log(`Now num nodes are: ${numNodes}`);
  };
  
  const addNewStepNode = () => {
    // placeholder nodeId based on existing num nodes
    numNodes += 1;
    const newNodeId = `step_${numNodes}`; // crypto.randomUUID();
    
    // add node to vivarium builder state
    vivarium.addProcess(newNodeId, `local:${newNodeId}`);
    const newNode = vivarium.getFlowNodeConfig(newNodeId) as CustomNodeType;
    
    // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
    if (newNode) {  // acts as a sanity check
      setNodes((existingNodes) => {
        const updatedNodes = [...existingNodes, newNode]; // represents the latest state
        console.log("Updated Nodes:", updatedNodes);
        return updatedNodes;
      });
    }
    console.log(`Now num nodes are: ${numNodes}`);
  };
  
  const addNewStoreNode = () => {
    const newNodeId = `store-${crypto.randomUUID()}`;
    const store: StoreNodeData = {
      nodeId: newNodeId,
      value: ["empty_store"],
      connections: ["None"] as string[]
    }
    const newNode: StoreNode = {
      id: newNodeId, // Unique ID
      type: "store-node", // Match the type used in `nodeTypes`
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
      data: store
    };
    
    // the parameter consumed by setNodes is this component's 'nodes' attribute aka: CustomNodeType[] aka BigraphFlowNode[] | StoreFlowNode[]
    setNodes((existingNodes) => [...existingNodes, newNode]);
  };
  
  // project name setter
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update state with input value
  };

  return (
    <div className="reactflow-wrapper" style={{ height: "100vh", width: "100vw" }}>
      <div className="project-name">
          <input
            id="inputField"
            type="text"
            value={inputValue}
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
        fitView
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
          onClick={addNewProcessNode}
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
          onClick={addNewStepNode}
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
          onClick={addNewStoreNode}
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
