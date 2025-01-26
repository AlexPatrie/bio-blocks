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
  StoreNodeType
} from "../../datamodel";
import { Handle, NodeProps, Position } from "@xyflow/react";
import {StoreField} from "./StoreField";


export function StoreNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
  id,
}: NodeProps<BigraphFlowNodeType>) {
  // set position TODO: fix this
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const nodeData = data as StoreNodeType;
  
  // this is the method that should add and verify the ports on user "Enter" event
  const handleInputChange = useCallback((
    keyboardEvent: React.KeyboardEvent<HTMLInputElement> | null,
    changeEvent: React.ChangeEvent<HTMLInputElement> | null,
    field: string
    ) => {
      if (keyboardEvent?.key === "Enter") {
        console.log('Enter clicked!')
      }
      
      console.log(`Store ${id} updated:`, nodeData);
    },
    [data, id]
  );
  
  const handleConnectionChange = (value: any) => {
    // TODO: add new connections on edge change
  }
  
  const currentData = data as StoreNodeType;
  const node = currentData;
  return (
    <div className="react-flow__node-default flow store-node">
      
      {/* Node Id/Name */}
      <h3 className="node-header">
        {/*<StoreField
          storeNode={currentData}
          field="value"
          handleInputChange={(keyEvent, changeEvent,field) => handleInputChange(keyEvent, changeEvent, field as string)}
        />*/}
        <input
          type="text"
          value={currentData.value}
          autoFocus
          placeholder="Enter field"
        />
      </h3>
      
      {/* dynamically add input handles based on the number of inputs */}
      {/* Input Handle */}
      <Handle type="target" position={Position.Left}/>
      {/* Output Handle */}
      <Handle type="source" position={Position.Right}/>
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
