import { useCallback } from "react";
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

export default function App() {
  const [nodes, , onNodesChange] = useNodesState<CustomNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdgeType>(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const exportGraph = () => {
    const graphRepresentation = {
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

    const jsonString = JSON.stringify(graphRepresentation, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const link = document.createElement("a");
    const downloadFilename = "bigraph.json";
    link.href = URL.createObjectURL(blob);
    link.download = downloadFilename

    // Trigger the download
    link.click();

    // Revoke the object URL to free up resources
    URL.revokeObjectURL(link.href);

    alert(`Graph exported and downloaded as ${downloadFilename}!`);
  };

  return (
    <div className="reactflow-wrapper" style={{ height: "100vh", width: "100vw" }}>
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
  </div>
  );
}
