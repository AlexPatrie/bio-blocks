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
    const graphData = { nodes, edges };
    const blob = new Blob([JSON.stringify(graphData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph.json";
    a.click();
    URL.revokeObjectURL(url);
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
