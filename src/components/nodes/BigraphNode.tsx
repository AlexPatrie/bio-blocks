import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { BigraphFlowNode } from "../../data_model";
import {useState} from "react";

const handleStyle = { left: 10 };

export function ConstructBigraphNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<BigraphFlowNode>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;
  const onConnection = () => {
      console.log("Connection");
  }

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default flow">
      <table className="process-table-display type">
        <thead>
        <tr>
          <th>Type</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td data-label="Type">{data._type}</td>
        </tr>
        </tbody>
      </table>
      <table className="process-table-display address">
        <thead>
        <tr>
          <th>Address</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td data-label="Address">{data.address}</td>
        </tr>
        </tbody>
      </table>
      <table className="process-table-display inputs">
        <thead>
        <tr>
          <th>Inputs</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          {Object.keys(data.inputs).map((input, index) => (
            <td key={index}>{input}</td>
          ))}
        </tr>
        </tbody>
      </table>
      <table className="process-table-display outputs">
        <thead>
        <tr>
          <th>Outputs</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          {Object.keys(data.outputs).map((output, index) => (
            <td key={index}>{output}</td>
          ))}
        </tr>
        </tbody>
      </table>

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} onConnect={onConnection}/>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right}/>
    </div>
  );
}
