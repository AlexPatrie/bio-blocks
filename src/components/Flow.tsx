import {useCallback, useState} from "react";
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
// import {BigraphFlowNode, BigraphNode, BigraphNodeSpec, BigraphSpec, BigraphState} from "../data_model";
import JSZip from "jszip";
import {CompositeSpecType, NodeType, StateSpecType} from "../datamodel";
import {initialNodes, initialEdges} from "../examples";

// TODO: create method which takes in only spec.json and infers edges/block-specific data from the input/output ports!
// TODO: create button which dynamically adds new nodes to the initialNodes array
// TODO: change block table elements to be string <inputs> that are dynamically created if not using the registry

export default function App() {
  // hooks
  const [inputValue, setInputValue] = useState<string>('My Composition');
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(initialEdges);
  
  // graph connector
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
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
      const nodeData = node.data as NodeType;
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
  const handleLoadGraph: (data: CompositeSpecType) => void = (data: CompositeSpecType): void => {
    console.log(`Data: ${JSON.stringify(data)}`);
    // setNodes(data.nodes);
    // setEdges(data.edges);

  };
  
  // new node constructor
  const addNewProcessNode = (local: boolean = true) => {
    const newNode = {
      id: `node-${nodes.length + 1}`, // Unique ID
      type: "bigraph-node", // Match the type used in `nodeTypes`
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
      type: "customStepNode", // Match the type used in `nodeTypes`
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
        <UploadSpec onLoadGraph={handleLoadGraph}/>
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
      </div>
    </div>
  );
}
