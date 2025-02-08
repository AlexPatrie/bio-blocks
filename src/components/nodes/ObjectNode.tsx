import React, {useCallback, useState} from "react";
import {Handle, NodeProps, Position, useReactFlow} from "@xyflow/react";

import {
  BigraphNodeData, FlowEdgeConfig,
  FlowNodePosition,
  ObjectNode as _ObjectNode,
  ObjectNodeData, PlaceEdge,
  StoreNodeData
} from "../../datamodel";
import {NodeField} from "./NodeField";
import {StoreNodeField} from "./StoreNodeField";
import {randomInRange} from "../../connect";
import {CustomNodeType} from "./index";

export function ObjectNode({
  data,
  id,
}: NodeProps<_ObjectNode>) {
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const nodeData = data as ObjectNodeData;
  const [numLeaves, setNumLeaves] = useState<number>(0);
  const { setNodes, setEdges } = useReactFlow();
  
  // called when user clicks to add a leaf
  const addLeaf = useCallback(() => {
    const newLeafId = `new_leaf_${randomInRange(0, numLeaves + 3)}`
    const newLeafData: ObjectNodeData = {
      value: [newLeafId],
      connections: [id],
      nodeId: newLeafId,
    };
    
    const newFlowLeaf = {
      id: newLeafId,
      type: "object-node",
      position: {
        x: randomInRange(0, numLeaves + 3),
        y: randomInRange(0, numLeaves + 3),
      },
      data: newLeafData,
    }
    
    setNodes((existingNodes) => {
      return [...existingNodes, newFlowLeaf];
    });
    
    setEdges((existingEdges) => {
      const newFlowEdge: FlowEdgeConfig = {
        id: `${id}->${newLeafId}`,
        source: id,
        target: newLeafId,
        type: "place-edge",
        animated: false
      };
      return [...existingEdges, newFlowEdge];
    })
    
  }, [setNodes, setEdges])
  
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
        position={Position.Top}
        className="port-handle input-handle"
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="port-handle output-handle"
      />
      <button onClick={addLeaf}>Add leaf</button>
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
