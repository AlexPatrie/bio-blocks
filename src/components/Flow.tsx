import React, {useCallback, useState} from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes, type CustomNodeType } from "./nodes";
import { edgeTypes, type CustomEdgeType } from "./edges";
import UploadSpec from "./UploadSpec";
import JSZip from "jszip";
import {validateUpload} from "../io";
import {CompositeSpecType, BigraphNodeType, StateSpecType, CompositionType} from "../datamodel";
import {
  initialNodes,
  initialEdges,
  // initialInputStores,
  // initialOutputStores
} from "../examples";

// TODO: create method which takes in only spec.json and infers edges/block-specific data from the input/output ports!
// TODO: create button which dynamically adds new nodes to the initialNodes array
// TODO: change block table elements to be string <inputs> that are dynamically created if not using the registry

export default function App() {
  // hooks
  const [inputValue, setInputValue] = useState<string>('My Composition');
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(initialEdges);
  // const [inputStores, setInputStores, onInputStoresChange] = useNodesState<CustomNodeType>(initialInputStores);
  // const [outputStores, setOutputStores, onOutputStoresChange] = useNodesState<CustomNodeType>(initialOutputStores);
  // inputStores.forEach((storeNode: CustomNodeType) => {
  //   nodes.push(storeNode);
  // });
  
  // TODO: create a method which takes in a connection and some validation constraints/parameters
  const validateConnection = (connection: any): boolean => {
    console.log('This is the connections: ', JSON.stringify(connection, null, 2));
    return true;
  
  }
  
  // graph connector
  const onConnect: OnConnect = useCallback(
    (connection) => {
      // Call your validation function
      const isValid = validateConnection(connection);
  
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
    
    const bigraphState: StateSpecType = {};
    nodes.forEach((node: CustomNodeType) => {  // CustomNodeType is the base class on which process-bigraph representation of "state" nodes are constructed
      const nodeData = node.data as BigraphNodeType;
      const nodeId = nodeData.nodeId as string;
      bigraphState[nodeId] = {
        _type: nodeData._type,
        address: nodeData.address,
        config: nodeData.config,
        inputs: nodeData.inputs,
        outputs: nodeData.outputs
      };
    });
    
    // get project name
    const projectName = inputValue.split(" ").join("_").toLowerCase();
    
    const zip = new JSZip();
    zip.file("blocks.json", JSON.stringify(flowRepresentation, null, 2));
    zip.file("bigraph.json", JSON.stringify(bigraphState, null, 2));
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${projectName}.zip`;
        link.click();

        URL.revokeObjectURL(link.href);
        alert("Graph and metadata exported as composition.zip!");
    });
  };
  
  // graph loader (reader)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    let isValidSpec = true;
    reader.onload = (e) => {
      try {8
        // Parse the JSON
        const jsonData = JSON.parse(e.target?.result as string);
        
        // iterate over the keys (node names) then iterate over the node.
        Object.keys(jsonData).forEach((key: string) => {
          const uploadedNode = jsonData[key];
          isValidSpec = validateUpload(uploadedNode);
        });
        
        // Validate and set the data
        if (isValidSpec) {
          // setData(jsonData);  HERE setData should create new node elements (html)
          console.log("Uploaded and parsed data:", jsonData);
        } else {
          alert("Invalid JSON structure!");
        }
      } catch (err) {
        console.error("Error reading or parsing file:", err);
        alert("Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };
  
  // new node constructor
  const addNewProcessNode = (local: boolean = true) => {
    const newNode = {
      id: `node-${nodes.length + 1}`, // Unique ID
      type: "process-node", // Match the type used in `nodeTypes`
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
      data: {
        _type: "process",
        address: "",
        inputs: {},
        outputs: {},
        config: {},
      }, // add new node with empty fields
    };
  
    setNodes((nds) => [...nds, newNode]);
  };
  
  const addNewStepNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`, // Unique ID
      type: "step-node", // Match the type used in `nodeTypes`
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
      data: {
        _type: "step",
        address: "",
        inputs: {},
        outputs: {},
        config: {},
      }, // add new node with empty fields
    };
  
    setNodes((nds) => [...nds, newNode]);
  };
  
  const addNewStoreNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`, // Unique ID
      type: "store-node", // Match the type used in `nodeTypes`
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
      data: {
        value: "",
      }, // add new node with empty fields
    };
  
    setNodes((nds) => [...nds, newNode]);
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
        <UploadSpec onLoadGraph={handleFileUpload}/>
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
          onClick={l => addNewProcessNode}
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
