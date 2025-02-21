import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  Connection,
  Handle,
  NodeProps,
  Position,
  useNodesData,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals
} from "@xyflow/react";

import {BigraphNode as _BigraphNode, BigraphNodeData, FlowNodePosition, StoreNodeData} from "../../datamodel";
import {NodeField} from "./NodeField";
import type {CustomNodeType} from "./index";
import {NewPortCallbackContext, PortChangeCallbackContext} from "../../PortCallbackContext";
import {validateConnection} from "../../connect";
import BasicDropdownButton from "../DropdownButton";
import DropdownProcessMenu from "../DropdownMenu";


export type BigraphNodeProps = {
  data: BigraphNodeData;
  id: string;
}

export function BigraphNode({ data, id }: BigraphNodeProps) {
  const [editMode, setEditMode] = useState(false);
  const [nodeId, setNodeId] = useState<string>(data.nodeId);
  const [type, setType] = useState<string>(data._type);
  const [address, setAddress] = useState<string>(data.address);
  const [inputData, setInputData] = useState(data.inputs);
  const [outputData, setOutputData] = useState(data.outputs);
  const [numInputHandles, setNumInputHandles] = useState<number>(0);
  const [numOutputHandles, setNumOutputHandles] = useState<number>(0);
  
  const { setNodes } = useReactFlow();
  const onRemoveClick = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };
  
  const flowNodeData = useNodesData(id);
  
  const newPortCallbackMap = useContext(NewPortCallbackContext);
  const onPortAdded = newPortCallbackMap?.get(id);
  const onPortChanged = useContext(PortChangeCallbackContext);
  
  const updateNodeInternals = useUpdateNodeInternals();
  
  const handlePortValueChange = (portType: string, portName: string, newValue: string) => {
    /* portType: inputs | outputs, portName: existing port name of input/output that will be changed, newValue: new value to sync to port name */
    onPortChanged(id, portType, portName, newValue);
    console.log(`Detected change on port type; ${portType} with portName: ${portName} and newValue: ${newValue}`);
  };
  
  const handleInputChange = (portName: string, newValue: string) => {
    handlePortValueChange("inputs", portName, newValue);
  };
  
  const handleOutputChange = (portName: string, newValue: string) => {
    handlePortValueChange("outputs", portName, newValue);
  };
  
  const addInputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_input_${uuid.slice(uuid.length - 3, uuid.length)}`;
    const portValue = [`${portName}_store`];
    
    setInputData((previousInputData: Record<string, string[]>) => ({
      ...previousInputData,
      [portName]: portValue
    }));
    setNumInputHandles((prevNumHandles) => {
      return prevNumHandles + 1;
    });
    updateNodeInternals(id);
    
    if (onPortAdded) {
      onPortAdded(nodeId, "inputs", portName);
    } else {
      console.log('no callback!')
    }
  }, [numInputHandles, nodeId, id, onPortAdded, updateNodeInternals]);
  
  const connectInputPort = useCallback((portName: string) => {
    const portValue = [`${portName}_store`];
    
    setInputData((previousInputData: Record<string, string[]>) => ({
      ...previousInputData,
      [portName]: portValue
    }));
    setNumInputHandles((prevNumHandles) => {
      return prevNumHandles + 1;
    });
    updateNodeInternals(id);
    
    if (onPortChanged) {
      onPortChanged(nodeId, "inputs", portName, portName);
    } else {
      console.log('no callback!')
    }
  }, [numInputHandles, nodeId, id, onPortChanged, updateNodeInternals]);
    
  const addOutputPort = useCallback(() => {
    const uuid = crypto.randomUUID();
    const portName = `new_output_${uuid.slice(uuid.length - 3, uuid.length)}`;
    const portValue = [`${portName}_store`];
    
    setOutputData((previousOutputData: Record<string, string[]>) => ({
      ...previousOutputData,
      [portName]: portValue
    }));
    setNumInputHandles(numOutputHandles + 1);
    updateNodeInternals(id);
    
    if (onPortAdded) {
      onPortAdded(id, "outputs", portName);
    } else {
      console.log('no callback!')
    }
  }, [numOutputHandles, nodeId, onPortAdded, updateNodeInternals]);
  
  const connectOutputPort = useCallback((portName: string) => {
    const portValue = [`${portName}_store`];
    
    setOutputData((previousOutputData: Record<string, string[]>) => ({
      ...previousOutputData,
      [portName]: portValue
    }));
    setNumOutputHandles((prevNumHandles) => {
      return prevNumHandles + 1;
    });
    updateNodeInternals(id);
    
    if (onPortChanged) {
      onPortChanged(nodeId, "outputs", portName, portName);
    } else {
      console.log('no callback!')
    }
  }, [numOutputHandles, nodeId, id, onPortChanged, updateNodeInternals]);
  
  const handleChange = useCallback(() => {
    console.log('Detected change on port type');
  }, []);
  
  const onConnect = useCallback((connection: Connection) => {
    // perform verification in hook
    setNodes((nodes: CustomNodeType[]) => {
      const isValidConnection: boolean = validateConnection(nodes, connection);
      
      if (isValidConnection) {
        if (connection.source === id) {
          connectOutputPort(connection.target);
        } else {
          const objectId = connection.source;
          connectInputPort(objectId);
        }
      } else {
        alert(
          `You cannot directly connect two processes. Please connect process ports to objects.`
        )
      }
      return nodes;
    });
  }, [connectOutputPort, connectInputPort, setNodes]);

  return (
    <div className="react-flow__node bigraph-node">
      {/* Node Id/Name */}
      <div className="node-header">
        <h3>
          {/*<NodeField
            data={data}
            portName={"nodeId"}
          />*/}
          <DropdownProcessMenu processId={id} processType={type} processAddress={address} handleChange={handleChange}/>
        </h3>
        <button className="remove-process-button" onClick={onRemoveClick}>X</button>
      </div>
      
      <div className="node-grid">
        
        {/*
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
        */}
       
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
                      onPortValueChange={handleInputChange}
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
                      onPortValueChange={handleOutputChange}
                    />
                  </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
     
        
        {/* Hardcoded handles */}
        {Object.keys(inputData).length ? Object.keys(inputData).map((inputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="target"
              onConnect={onConnect}
              className="port-handle input-handle"
              position={Position.Left}
              id={inputName}
            />
          </div>
        ))
        :
        <div>
          <Handle
            type="target"
            onConnect={onConnect}
            className="port-handle input-handle"
            position={Position.Left}
            id="inputs"
          />
        </div>}
        
        {Object.keys(outputData).length ? Object.keys(outputData).map((outputName: string, index: number) => (
          <div>
            <Handle
              key={index}
              type="source"
              onConnect={onConnect}
              className="port-handle output-handle"
              position={Position.Right}
              id={outputName}
            />
          </div>
        ))
        :
        <div>
          <Handle
            type="source"
            onConnect={onConnect}
            className="port-handle output-handle"
            position={Position.Right}
            id="outputs"
          />
        </div>}
        
      </div>
    </div>
  );
}


