import React, { useCallback } from "react";
import {BigraphFlowNode, BigraphNodeKey} from "../../data_model";
import {Handle, NodeProps, Position} from "@xyflow/react";
import {NodeField} from "./NodeField";


export function ConstructNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
}: NodeProps<BigraphFlowNode>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, field: BigraphNodeKey) => {
      data[field] = event.target.value;
      console.log(`Node ${id} updated:`, data);
    },
    [data, id]
  );

  return (
    <div className="react-flow__node-default flow">
      <h3>
        <NodeField
          data={data}
          field="nodeId"
          handleInputChange={(e, field) => handleInputChange(e, field)}
        />
      </h3>
      <table className="process-table-display type">
        <thead>
        <tr>
          <th>Type</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td data-label="Type">
              <input
                type="text"
                value={data._type || ""}
                onChange={(e) => handleInputChange(e, "_type")}
                placeholder="Enter type"
              />
            </td>
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
            <td data-label="Address">
              <input
                type="text"
                value={data.address || ""}
                onChange={(e) => handleInputChange(e, "address")}
                placeholder="Enter address"
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* Input Handle */}
      <Handle type="target" position={Position.Left} />
      {/* Output Handle */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
