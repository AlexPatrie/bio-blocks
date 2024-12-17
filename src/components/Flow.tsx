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
import { initialNodes, nodeTypes, type CustomNodeType } from "./nodes";
import { initialEdges, edgeTypes, type CustomEdgeType } from "./edges";
import UploadSpec from "./UploadSpec";
import {BigraphNode, BigraphSpec, BigraphState} from "../data_model";
import JSZip from "jszip";

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
  const exportGraph = () => {
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
    
    const bigraphState: BigraphState = {};
    nodes.forEach((node: CustomNodeType) => {  // process-bigraph representation of "state"
      bigraphState[node.id] = node.data as BigraphNode;
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
  const handleLoadGraph: (data: BigraphSpec) => void = (data: BigraphSpec): void => {
    console.log(`Data: ${JSON.stringify(data)}`);
    // setNodes(data.nodes);
    // setEdges(data.edges);

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
      <button
        onClick={exportGraph}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Export to JSON
      </button>
      <UploadSpec onLoadGraph={handleLoadGraph} />
  </div>
  );
}
