import React, { useCallback } from "react";
import {
  BigraphFlowNode,
  BigraphNode as BigraphNodeType,
  BigraphNodeKey,
  Port, Store
} from "../../data_model";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { NodeField } from "./NodeField";


export function BigraphNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
}: NodeProps<BigraphFlowNode>) {
  // set position TODO: fix this
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const nodeData = data as BigraphNodeType;
  const inputPorts = Object.keys(nodeData.inputs);
  const outputPorts = Object.keys(nodeData.outputs);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, field: BigraphNodeKey) => {
      const valueChange = event.target.value;
      switch (field) {
        case "inputs":
          const inputDataStore: Store = {
            value: [valueChange]
          }
          const inputPort: Port = {
            name: valueChange,
            store: inputDataStore,
          }
          nodeData.inputs[valueChange] = inputPort;
          break
        
        case "outputs":
          const outputDataStore: Store = {
            value: [valueChange]
          }
          const outputPort: Port = {
            name: valueChange,
            store: outputDataStore,
          }
          nodeData.outputs[valueChange] = outputPort;
          break
        
        case "config":
          nodeData.config[valueChange] = valueChange;
          break;
        
        default:
          nodeData[field] = valueChange;
      }
      
      console.log(`Node ${id} updated:`, nodeData);
    },
    [data, id]
  );

  return (
    <div className="react-flow__node-default flow">
      
      {/* Node Id/Name */}
      <h3 className="node-name">
        <NodeField
          data={data}
          key="nodeId"
          handleInputChange={(e, field) => handleInputChange(e, field)}
        />
      </h3>
      
      <div className="node-grid">
        <div className="grid-item">
          <table className="process-table-display type">
            <thead>
            <tr>
              <th className="node-attribute-name">Type</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td data-label="Type">
                <NodeField
                  data={data}
                  key="_type"
                  handleInputChange={(e, field) => handleInputChange(e, field)}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid-item">
          <table className="process-table-display address">
            <thead>
            <tr>
              <th className="node-attribute-name">Address</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td data-label="Address">
                <NodeField
                  data={data}
                  key="address"
                  handleInputChange={(e, field) => handleInputChange(e, field)}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid-item">
          <table className="process-table-display inputs">
            <thead>
            <tr>
              <th className="node-attribute-name">Inputs</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td data-label="Inputs">
                {inputPorts.map((portName, index) => (
                  <input
                    key={index} // Use the index as the key (or a unique value if available)
                    type="text"
                    value={portName}
                    onChange={(e) => handleInputChange(e, "inputs")} // Pass the index to identify which input changed
                    placeholder={`Input ${index + 1}`}
                    style={{marginBottom: "8px", display: "block"}} // Add spacing between inputs
                  />
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid-item">
          <table className="process-table-display outputs">
            <thead>
            <tr>
              <th className="node-attribute-name">Outputs</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td data-label="Outputs">
                {outputPorts.map((portName, index) => (
                  <input
                    key={index} // Use the index as the key (or a unique value if available)
                    type="text"
                    value={portName}
                    onChange={(e) => handleInputChange(e, "outputs")} // Pass the index to identify which input changed
                    placeholder={`output ${index + 1}`}
                    style={{marginBottom: "8px", display: "block"}} // Add spacing between inputs
                  />
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        {/* Input Handle */}
        <Handle type="target" position={Position.Left}/>
        
        {/* Output Handle */}
        <Handle type="source" position={Position.Right}/>
      </div>
    </div>
  );
}

// return (
//     <div className="react-flow__node-default flow">
//       {/* Node Id/Name */}
//       <h3>
//         <NodeField
//           data={data}
//           field="nodeId"
//           handleInputChange={(e, field) => handleInputChange(e, field)}
//         />
//       </h3>
//       <table className="process-table-display type">
//         <thead>
//         <tr>
//           <th>Type</th>
//         </tr>
//         </thead>
//         <tbody>
//         <tr>
//           <td data-label="Type">
//               <input
//                 type="text"
//                 value={data._type || ""}
//                 onChange={(e) => handleInputChange(e, "_type")}
//                 placeholder="Enter type"
//               />
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <table className="process-table-display address">
//         <thead>
//           <tr>
//             <th>Address</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td data-label="Address">
//               <input
//                 type="text"
//                 value={data.address || ""}
//                 onChange={(e) => handleInputChange(e, "address")}
//                 placeholder="Enter address"
//               />
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       {/* Input Handle */}
//       <Handle type="target" position={Position.Left} />
//       {/* Output Handle */}
//       <Handle type="source" position={Position.Right} />
//     </div>
//   );
