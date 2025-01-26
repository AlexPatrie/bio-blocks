import React, { useCallback } from "react";
// import {
//   BigraphFlowNode,
//   BigraphNode as BigraphNodeType,
//   BigraphNodeKey,
//   Port, Store
// } from "../../data_model";
import {
  BigraphFlowNodeType,
  NodeKeyType,
  StepNodeType
} from "../../datamodel";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { NodeField } from "./NodeField";
import {addInputPort, addOutputPort} from "../../connect";


export function StepNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
}: NodeProps<BigraphFlowNodeType>) {
  // set position TODO: fix this
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const nodeData = data as StepNodeType;
  const inputPorts = Object.keys(nodeData.inputs);
  const outputPorts = Object.keys(nodeData.outputs);
  
  // this is the method that should add and verify the ports on user "Enter" event
  const handleInputChange = useCallback((
    keyboardEvent: React.KeyboardEvent<HTMLInputElement> | null,
    changeEvent: React.ChangeEvent<HTMLInputElement> | null,
    field: NodeKeyType
    ) => {
      console.log('Input change triggered!', keyboardEvent, changeEvent);
      if (keyboardEvent?.key === "Enter") {
        console.log('Enter clicked!')
        switch (field) {
          case "inputs":
            // TODO: make a new StoreNode here if the value is different.
            console.log(`Inputs clicked: value: ${nodeData.inputs[field]}`);
            break;
          // const inputDataStore: StoreType = {
          //   value: [valueChange]
          // }
          // const inputPort: PortType = {
          //   name: valueChange,
          //   store: inputDataStore,
          // }
          // nodeData.inputs[valueChange] = inputPort;
          // break
          
          case "outputs":
            // TODO: make a new StoreNode here if the value is different.
            addOutputPort(nodeData, field);
            break
          
          case "config":
            if (changeEvent) {
              nodeData.config[field] = changeEvent.target.value;
            }
            break;
            
          default:
            if (changeEvent) {
               nodeData[field] = changeEvent.target.value;
            }
            break;
        }
      }
      
      console.log(`Node ${id} updated:`, nodeData);
    },
    [data, id]
  );
  
  const currentData = data as StepNodeType;
  currentData._type = 'step';
  const node = currentData;
  return (
    <div className="react-flow__node-default flow">
      
      {/* Node Id/Name */}
      <h3 className="node-header">
        <NodeField
          data={currentData}
          field="nodeId"
          handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as NodeKeyType)}
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
                  data={currentData}
                  field="_type"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as NodeKeyType)}
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
                  data={currentData}
                  field="address"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as NodeKeyType)}
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
                <NodeField
                  data={currentData}
                  field="inputs"
                  handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as NodeKeyType)}
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
                <NodeField
                  data={currentData}
                  field="outputs"
                  handleInputChange={(keyEvent, changeEvent, field) => handleInputChange(keyEvent, changeEvent, field as NodeKeyType)}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        {/* dynamically add input handles based on the number of inputs */}
        {Object.keys(node.inputs).map((inputName: string, index: number) => (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            id={inputName}  // {`input-${index}`}
            style={{ top: `${(index + 1) * (100 / (node.inputs.length + 1))}%` }}
          />
        ))}
        
        {/* dynamically add output handles based on the number of inputs */}
        {Object.keys(node.outputs).map((outputName: string, index: number) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={outputName}  // {`input-${index}`}
            style={{ top: `${(index + 1) * (100 / (node.outputs.length + 1))}%` }}
          />
        ))}
        
        {/* Input Handle */}
        {/*<Handle type="target" position={Position.Left}/>*/}
        
        {/* Output Handle */}
        {/*<Handle type="source" position={Position.Right}/>*/}
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
