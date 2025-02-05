import React, {useCallback, useState} from "react";
import {Handle, NodeProps, Position, useNodesState, useUpdateNodeInternals} from "@xyflow/react";

import {BigraphNode as _BigraphNode, BigraphNodeData, StoreNodeData} from "../../datamodel";
import {NodeField} from "./NodeField";
import type {CustomNodeType} from "./index";
import {VivariumService} from "../../services/VivariumService";
import {node} from "prop-types";
import {StoreNode} from "./StoreNode";


export type BigraphNodeProps = {
  props: BigraphNodeData | any;
}

export function BigraphNode({ props }: BigraphNodeProps) {
  const { data, addStoreNode } = props;
  // editing toggle hook
  const [editMode, setEditMode] = useState(false);
  
  // node attribute hooks
  const [nodeId, setNodeId] = useState<string>(data.nodeId);
  const [type, setType] = useState<string>(data._type);
  const [address, setAddress] = useState<string>(data.address);
  const [inputData, setInputData] = useState(data.inputs);
  const [outputData, setOutputData] = useState(data.outputs);
  
  // dynamic num handles for ports
  const [numHandles, setNumHandles] = useState<number>(0);
  
  const updateNodeInternals = useUpdateNodeInternals();
  
  const addInputPort = useCallback(() => {
    /*
      This function should:
        1. use setInputData to update the node input field
        2. create a new store node with
    */
    const uuid = crypto.randomUUID();
    const portName = `new_input_${uuid.slice(uuid.length - 3, uuid.length)}`;
    const portValue = [`${portName}_store`];
    // set the input data state
    setInputData((previousInputData: Record<string, string[]>) => ({
      ...previousInputData,
      [portName]: portValue
    }));
    setNumHandles(numHandles + 1);
    updateNodeInternals(nodeId);
    
    // add a store node for the corresponding data
    addStoreNode(portName, portValue, [nodeId]);
  }, [numHandles, nodeId, updateNodeInternals, addStoreNode]);
  
  const addOutputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_output_${uuid.slice(uuid.length - 3, uuid.length)}`;
    setOutputData((outputData: Record<string, string[]>) => {
      outputData[portName] = [`${portName}_store`];
      return outputData;
    });
    setNumHandles(numHandles + 1);
    updateNodeInternals(nodeId);
  }, []);

  return (
    <div className="react-flow__node bigraph-node">
      
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
              <th className="node-attribute-name">
                Inputs
              </th>
              <button onClick={addInputPort}>+</button>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                {Object.keys(inputData).map((inputName: string, index: number) => (
                  <div>
                    <NodeField
                      data={inputData}
                      portName={inputName}
                    />
                  </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        
        {/*<div className="grid-item">
          <div>
            {stores.map((store) => (
              <StoreNode
                key={store.nodeId}
                id={store.nodeId}
                data={store} type={""} dragging={true} zIndex={0} isConnectable={true} positionAbsoluteX={0}
                positionAbsoluteY={0}        />
            ))}
          </div>
          <table className="process-table-display outputs">
            <thead>
            <tr>
              <th className="node-attribute-name">
                Outputs
              </th>
              <button onClick={addOutputPort}>+</button>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                {Object.keys(outputData).map((outputName: string, index: number) => (
                  <div>
                    <NodeField
                      data={outputData}
                      portName={outputName}
                    />
                  </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>*/}
     
        {/* input handles */}
        {Object.keys(inputData).map((inputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="target"
              className="port-handle input-handle"
              position={Position.Left}
              id={inputName}
            />
          </div>
        ))}
        
        {/* output handles */}
        {Object.keys(outputData).map((outputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="source"
              className="port-handle output-handle"
              position={Position.Right}
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
