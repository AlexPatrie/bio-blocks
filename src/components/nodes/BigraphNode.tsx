import React, {useCallback, useState} from "react";
import {Handle, NodeProps, Position, useNodesState} from "@xyflow/react";

import {BigraphNode as _BigraphNode, BigraphNodeData} from "../../datamodel";
import {NodeField} from "./NodeField";
import type {CustomNodeType} from "./index";
import {VivariumService} from "../../services/VivariumService";


export type BigraphNodeProps = {
  data: BigraphNodeData;
}

export function BigraphNode({ data }: BigraphNodeProps) {
  const [editMode, setEditMode] = useState(false);
  const [currentData, setData] = useState(data); // local state for editing
  const [inputData, setInputData] = useState(currentData.inputs);
  const [outputData, setOutputData] = useState(currentData.outputs);
  
  const addInputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_input_${uuid.slice(uuid.length - 3, uuid.length)}`;
    setInputData((inputData) => {
      inputData[portName] = [`${portName}_store`];
      return inputData;
    });
    
    // currentData.inputs[portName] = [`${portName}_store`];
    // return setData(currentData);
  }, [inputData]);
  
  const addOutputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_output_${uuid.slice(uuid.length - 3, uuid.length)}`;
    setOutputData((outputData) => {
      outputData[portName] = [`${portName}_store`];
      return outputData;
    });
    // currentData.inputs[portName] = [`${portName}_store`];
    // return setData(currentData);
  }, [outputData]);

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
