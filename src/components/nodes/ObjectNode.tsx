import React, {useCallback, useState} from "react";
import {Connection, Handle, NodeProps, OnConnect, Position, useReactFlow} from "@xyflow/react";

import {
  BigraphNodeData, FlowEdgeConfig,
  FlowNodePosition,
  ObjectNode as _ObjectNode,
  ObjectNodeData, PlaceEdge,
  StoreNodeData
} from "../datamodel/flow";
import {NodeField} from "./NodeField";
import {StoreNodeField} from "./StoreNodeField";
import {randomInRange} from "../../connect";
import {CustomNodeType} from "./index";

export function ObjectNode({
  data,
  id,
}: NodeProps<_ObjectNode>) {
  
  // parse node data and port names (for checking) TODO: use this to run validation on export!
  const [nodeData, setNodeData] = useState(data);
  const [numLeaves, setNumLeaves] = useState<number>(0);
  const { setNodes, setEdges } = useReactFlow();
  
  // called when user clicks to add a leaf
  const addLeaf = useCallback(() => {
    setNodeData((prevData) => {
      console.log(`In object node, the prev data is: ${JSON.stringify(prevData)}`);
      return prevData;
    });
    const newLeafId = `${nodeData.value}:leaf_${numLeaves + 1}`
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
    });
    setNumLeaves((existingNumLeaves) => {
      return existingNumLeaves + 1;
    })
  }, [setNodes, setEdges, setNumLeaves, numLeaves, nodeData]);
  
  // called when user clicks to add a leaf
  const _addLeaf = useCallback(() => {
    const newLeafId = `${nodeData.value}:leaf_${numLeaves + 1}`
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
    });
    setNumLeaves((existingNumLeaves) => {
      return existingNumLeaves + 1;
    })
  }, [setNodes, setEdges, setNumLeaves, numLeaves, nodeData]);
  
  const onRemoveClick = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };
  
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
  
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      console.log("On connect called in object node!")
      
      // HERE: automatically populate the inputs/outputs of an existing bigraph node if user drags a connection between node port and store port
  
      if (!connection.source || !connection.target) {
        console.error("Invalid connection: missing source or target");
        return;
      }
      
      // Add edge to state
      setEdges((prevEdges) => {
        const newEdge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: connection.source === id ? "place-edge" : "button-edge",
          animated: false
        };
  
        console.log("Adding edge:", newEdge);
        return [...prevEdges, newEdge];
      });
    },
    [setEdges]
  );
  
  return (
    <div className="react-flow__node object-node">
      <div className="object-node__content">
        <button className="remove-process-button" onClick={onRemoveClick}>X</button>
        
        <div className="store-node-header">
          <StoreNodeField data={data} setNodeData={setNodeData} />
        </div>
        
        <div className="add-leaf-button">
          <button onClick={addLeaf}>Add leaf</button>
        </div>
        
        {/* Place edge input handle */}
        <Handle
          type="target"
          id="place-input-handle"
          position={Position.Top}
          onConnect={onConnect}
          className="port-handle input-handle"
        />
        <Handle
          type="source"
          id="place-output-handle"
          position={Position.Bottom}
          onConnect={onConnect}
          className="port-handle output-handle"
        />
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
