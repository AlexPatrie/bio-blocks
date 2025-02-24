import React, { useCallback } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";

import {StoreNode as _StoreNode, StoreNodeData} from "../datamodel/flow";
import {NodeField} from "./NodeField";
import {StoreNodeField} from "./StoreNodeField";


export function StoreNode({
  data,
  id,
}: NodeProps<_StoreNode>) {
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const nodeData = data as StoreNodeData;
  
  // this is the method that should add and verify the ports on user "Enter" event
  const handleInputChange = useCallback((
    keyboardEvent: React.KeyboardEvent<HTMLInputElement> | null,
    changeEvent: React.ChangeEvent<HTMLInputElement> | null,
    field: string
    ) => {
      if (keyboardEvent?.key === "Enter") {
        console.log('Enter clicked in store!')
      }
      
      console.log(`Store ${id} updated:`, nodeData);
    },
    [data, id]
  );
  
  const handleConnectionChange = (value: any) => {
    // TODO: add new connections on edge change
  }
  
  return (
    <div className="react-flow__node store-node">
      
      {/* Node Id/Name */}
      <div className="store-node-header">
        <StoreNodeField data={data} />
      </div>
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={nodeData['inputPosition'] ? nodeData['inputPosition'] as Position : Position.Left}
        className="port-handle input-handle"
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={nodeData['outputPosition'] ? nodeData['outputPosition'] as Position : Position.Right}
        className="port-handle output-handle"
      />
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
