import React, { useCallback } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";

import {
  BigraphFlowNode,
  BigraphNodeKey,
  BigraphNode as BigraphNodeType,
} from "../../datamodel";
import { BigraphNodeField } from "./BigraphNodeField";


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
  
  // this is the method that should add and verify the ports on user "Enter" event
  const handleInputChange = useCallback((
    keyboardEvent: React.KeyboardEvent<HTMLInputElement> | null,
    changeEvent: React.ChangeEvent<HTMLInputElement> | null,
    field: BigraphNodeKey,
    ) => {
      if (keyboardEvent?.key === "Enter") {
        const newValue: string | undefined = changeEvent?.target.value;
        
        if (newValue) {
          console.log('Input change triggered!', keyboardEvent, changeEvent);
          switch (field) {
            case "inputs":
              // TODO: make a new StoreNode here if the value is different.
              console.log(`Inputs clicked: value: ${nodeData.inputs[field]}`);
              break;
            case "outputs":
              // TODO: make a new StoreNode here if the value is different.
              console.log(`Outputs clicked: value: ${nodeData.outputs[field]}`);
              break
            case "config":
              nodeData.config[field] = newValue;
              break;
            default:
              nodeData[field] = newValue;
              break;
          }
        }
        console.log(`Node ${id} updated:`, nodeData);
      }
    },
    [data, id]
  );
  
  const currentNodeState = data as BigraphNodeType;
  return (
    <div className="react-flow__node-default flow">
      
      {/* Node Id/Name */}
      <h3 className="node-header">
        <BigraphNodeField
          data={currentNodeState}
          field="nodeId"
          handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as BigraphNodeKey)}
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
                <BigraphNodeField
                  data={currentNodeState}
                  field="_type"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as BigraphNodeKey)}
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
                <BigraphNodeField
                  data={currentNodeState}
                  field="address"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as BigraphNodeKey)}
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
                <BigraphNodeField
                  data={currentNodeState}
                  field="inputs"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as BigraphNodeKey)}
                />
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
                <BigraphNodeField
                  data={currentNodeState}
                  field="outputs"
                  handleInputChange={(keyEvent, changeEvent, field) => handleInputChange(keyEvent, changeEvent, field as BigraphNodeKey)}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        {/* input handles */}
        {Object.keys(currentNodeState.inputs).map((inputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="target"
              className="port-handle input-handle"
              title={inputName}
              position={currentNodeState['inputPosition'] ? currentNodeState['inputPosition'] : Position.Left}
              id={inputName}  // {`input-${index}`}
              
            />
          </div>
        ))}
        
        {/* output handles */}
        {Object.keys(currentNodeState.outputs).map((outputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="source"
              className="port-handle output-handle"
              title={outputName}
              position={currentNodeState['outputPosition'] ? currentNodeState['outputPosition'] : Position.Right}
              id={outputName}  // {`input-${index}`}
            />
          </div>
        ))}
        
      </div>
    </div>
  );
}

// return (
//     <div className="react-flow__node-default flow">
//       {/* Node Id/Name */}
//       <h3>
//         <BigraphNodeField
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
