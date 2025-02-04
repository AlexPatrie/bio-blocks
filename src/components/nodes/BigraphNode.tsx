import React, {useCallback, useState} from "react";
import {Handle, NodeProps, Position, useNodesState} from "@xyflow/react";

import {BigraphNode as _BigraphNode, BigraphNodeData} from "../../datamodel";
import {NodeField} from "./NodeField";
import type {CustomNodeType} from "./index";


export type BigraphNodeProps = {
  data: BigraphNodeData;
  addProcessNode: () => void;
}

export function BigraphNode({ data, addProcessNode }: BigraphNodeProps) {
  const [editMode, setEditMode] = useState(false);
  const [currentData, setData] = useState(data); // local state for editing
  
  const addInputPort = useCallback(() => {
    // Update the state directly with new data
    const portName = `new_input_${crypto.randomUUID()}`
    data.inputs[portName] = [`${portName}_store`];
    //setData({ ...currentInputs, 'newInput': ["newInputStore"] });
    return setData(data);
  }, [currentData]);
  
  const addOutputPort = useCallback(() => {
    // Update the state directly with new data
    const portName = `new_output_${crypto.randomUUID()}`
    data.outputs[portName] = [`${portName}_store`];
    return setData(data);
  }, [currentData]);

  // this is the method that should add and verify the ports on user "Enter" event
  // const handleInputChange = useCallback(() => {
  //   },
  //   [data, id]
  // );
  

  return (
    <div className="react-flow__node">
      
      {/* Node Id/Name */}
      <div className="node-header">
        <h3>
          <NodeField
            data={data}
            portName={"nodeId"}
          />
        </h3>
        <div className="separate"></div>
      </div>
      
      
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
                  portName="_type"
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
                  portName={"address"}
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
              <button onClick={addInputPort}>Add input port</button>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                {Object.keys(data.inputs).map((inputName: string, index: number) => (
                  <div>
                    <NodeField
                      data={data.inputs}
                      portName={inputName}
                    />
                  </div>
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
              <button onClick={addOutputPort}>Add output port</button>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                {Object.keys(data.outputs).map((outputName: string, index: number) => (
                  <div>
                    <NodeField
                      data={data.outputs}
                      portName={outputName}
                    />
                  </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
     
        {/* input handles */}
        {Object.keys(data.inputs).map((inputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="target"
              className="port-handle input-handle"
              title={inputName}
              position={data['inputPosition'] ?data['inputPosition'] : Position.Left}
              id={inputName}  // {`input-${index}`}
              
            />
          </div>
        ))}
        
        {/* output handles */}
        {Object.keys(data.outputs).map((outputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="source"
              className="port-handle output-handle"
              title={outputName}
              position={data['outputPosition'] ? data['outputPosition'] : Position.Right}
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
