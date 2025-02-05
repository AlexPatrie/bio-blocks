import React, {useCallback, useContext, useState} from "react";
import {Handle, NodeProps, Position, useNodesState, useUpdateNodeInternals} from "@xyflow/react";

import {BigraphNode as _BigraphNode, BigraphNodeData, FlowNodePosition, StoreNodeData} from "../../datamodel";
import {NodeField} from "./NodeField";
import type {CustomNodeType} from "./index";
import {VivariumService} from "../../services/VivariumService";
import {node} from "prop-types";
import {StoreNode} from "./StoreNode";
import {PortCallbackContext} from "../../PortCallbackContext";


export type BigraphNodeProps = {
  data: BigraphNodeData;
  id: string;
}

export function BigraphNode({ data, id }: BigraphNodeProps) {
  const portCallbackMap = useContext(PortCallbackContext);
  const onPortAdded = portCallbackMap?.get(id);
  
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
    
    // here, onPortAdded is a function within the parent (Flow) which is parameterized by content within this component.
    if (onPortAdded) {
      onPortAdded(nodeId, "inputs", portName);
    } else {
      console.log('no callback!')
    }
  }, [numHandles, nodeId, updateNodeInternals, onPortAdded]);
  
  const addOutputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_output_${uuid.slice(uuid.length - 3, uuid.length)}`;
    const portValue = [`${portName}_store`];
    
    // set the input data state
    setOutputData((previousOutputData: Record<string, string[]>) => ({
      ...previousOutputData,
      [portName]: portValue
    }));
    
    setNumHandles(numHandles + 1);
    updateNodeInternals(nodeId);
    
    // here, onPortAdded is a function within the parent (Flow) which is parameterized by content within this component.
    if (onPortAdded) {
      onPortAdded(id, "outputs", portName);
    } else {
      console.log('no callback!')
    }
  }, [numHandles, nodeId, updateNodeInternals, onPortAdded]);

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
        <div className="grid-item">
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
        </div>
     
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


