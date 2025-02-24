import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import ComposeService from "../services/ComposeService";
import GenericDropdownButton, {DropdownItem} from "./GenericDropdownButton";
import { Dropdown } from "react-bootstrap";
import {DropdownItem as BootstrapDropdownItem} from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import {InputPortSchema, OutputPortSchema, ProcessMetadata, StateData} from "./datamodel/requests";
import DataDropdown from "./DataDropdown";
import { FromMetadataContext } from "../contexts/FromMetadataContext";
import { NewProcessContext } from "../contexts/FromMetadataContext";
import {BigraphNodeData} from "../datamodel";
import type {CustomNodeType} from "./nodes";
import {useReactFlow} from "@xyflow/react";
import {randomPosition} from "../connect";


// TODO: add logic for creating a new process node parameterized by the data returned here

export type GetProcessMetadataProps = {
  setNewNode: (flowNode: CustomNodeType, nodeId: string) => void;
  handlePortAdded: (nodeId: string, portType: string, portName: string) => void;
};

export default function GetProcessMetadata({ setNewNode, handlePortAdded }: GetProcessMetadataProps) {
  const [render, setRender] = useState(true);
  const [processId, setProcessId] = useState<string>("simple-membrane-process");
  const [returnCompositeState, setReturnCompositeState] = useState<boolean>(true);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [genericFile, setGenericFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<ProcessMetadata | null>(null);
  const [buttonItems, setButtonItems] = useState<DropdownItem[]>([]);
  const [createProcessClicked, setCreateProcessClicked] = useState<boolean>(false);
  const nodeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const service = new ComposeService();
  
  const resetProcessData = useCallback(() => {
    setCreateProcessClicked((prev: boolean) => {
      return false;
    });
    setResponseData((prevData: ProcessMetadata | null) => {
      return null;
    });
    setButtonItems((prevButtonItems: DropdownItem[]) => {
      return [];
    });
    setProcessId((prevProcessId: string) => {
      return "";
    })
  }, [setCreateProcessClicked, setResponseData, setButtonItems, setProcessId]);
  
  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, setter: (value: File | null) => void) => {
      event.stopPropagation();
      if (event.target.files && event.target.files.length > 0) {
        setter(event.target.files[0]);
      }
  }, []);
  
  const onConfigFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event, setConfigFile);
  }, [setConfigFile, onFileChange]);
  
  const onGenericFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event, setGenericFile);
  }, [setGenericFile, onFileChange]);
  
  const onError = (error: Error) => {
    console.error(error);
    alert(`The following error occurred while processing your data: ${ error }`);
  }
  
  const onSubmit = useCallback(() => {
    service.submitProcessMetadata(configFile, genericFile, processId, returnCompositeState)
      .then((response) => {
        if (response) {
          // set response data
          setResponseData((prevData: ProcessMetadata | null) => {
            return {
              ...prevData,
              ...response
            }
          });
          
          // set button data
          let newData: DropdownItem[] = [];
          Object.keys(response).forEach((key: string) => {
            const item: DropdownItem = { data: response[key] }
            newData.push(item);
          });
          setButtonItems((prevItems: DropdownItem[]) => {
            console.log(`Now items: ${newData}`);
            return [...prevItems, ...newData];
          });
          
          // set process id
          setProcessId((prevId: string) => {
            return getNodeId(response);
          })
        }
      })
      .catch((error: Error) => {
        onError(error);
      })
  }, [configFile, genericFile, processId, setResponseData, returnCompositeState, onError, setButtonItems]);
  
  const renderTimeout = useCallback((newNodeId: string) => {
    setTimeout(() => {
      if (nodeRefs.current[newNodeId]) {
        nodeRefs.current[newNodeId]?.focus();
      }}, 50);
  }, [nodeRefs]);
  
  const getNodeId = (processMetadata: ProcessMetadata) => {
    return processMetadata.process_address
      .split(':')
      .filter((item) => item !== "local")[0];
  }
  
  const createProcess = useCallback((processMetadata: ProcessMetadata) => {
      console.log(`Create process called with process metadata: ${ JSON.stringify(processMetadata) }`);
      
      const nodeId = getNodeId(processMetadata);
      const inputs = processMetadata.input_schema;
      const outputs = processMetadata.output_schema;
      
      const nodeData: BigraphNodeData = {
        _type: "process",
        config: {},
        address: processMetadata.process_address,
        inputs: inputs,
        outputs: outputs,
        nodeId: nodeId,
      };
      const newFlowNode: CustomNodeType = {
        id: nodeId,
        type: 'bigraph-node',
        position: randomPosition(),
        data: nodeData
      };
      
      setNewNode(newFlowNode, nodeId);
      renderTimeout(nodeId);
      
      // TODO: now, handle port added for each input and output port
      Object.keys(inputs).forEach((key: string) => {
        handlePortAdded(nodeId, "inputs", key)
      });
      
      Object.keys(outputs).forEach((key: string) => {
        handlePortAdded(nodeId, "outputs", key);
      });
  }, [responseData, setNewNode, handlePortAdded, renderTimeout]);
  
  const onCreateProcess = useCallback(() => {
    setResponseData((prevData: ProcessMetadata | null) => {
      if (prevData) {
        setCreateProcessClicked((prev) => {
          return true;
        });
      }
      return prevData;
    })
  }, [setCreateProcessClicked, setResponseData]);
  
  useEffect(() => {
    console.log(`The response data is: ${JSON.stringify(responseData)}`);
    if (createProcessClicked) {
      setResponseData((existingData: ProcessMetadata | null) => {
        if (existingData) {
          createProcess(existingData);
          renderTimeout(
            getNodeId(existingData)
          );
        } else {
          alert("The response data is not yet ready.");
        }
        return existingData;
      });
      resetProcessData();
    }
  }, [responseData, setResponseData, createProcessClicked, createProcess, resetProcessData]);
  
  const variant = "Success"
  
  if (render) {
    return (
      <div className="p-4">
        <DropdownButton
          title={"Get Process Info"}
          key={variant}
          id={`dropdown-variants-${variant}`}
          variant={variant.toLowerCase()}
        >
          <div className="param-items">
            <div className="my-2 param-item">
              <label className="block font-semibold">Config JSON File:</label>
              <input
                type="file"
                accept=".json"
                onChange={onConfigFileChange}
                className="border p-2"
              />
            </div>
            
            <div className="my-2 param-item">
              <label className="block font-semibold">Generic File:</label>
              <input type="file" onChange={onGenericFileChange} className="border p-2" />
            </div>
            
            <div className="my-2 param-item">
              <label className="block font-semibold">Process ID:</label>
              <input
                type="text"
                placeholder={processId}
                // value={processId}
                onChange={(e) => setProcessId(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            
            <div className="my-2 flex items-center param-item">
              <input
                type="checkbox"
                checked={returnCompositeState}
                onChange={(e) => setReturnCompositeState(e.target.checked)}
                className="mr-2"
              />
              <label>Return Composite State</label>
            </div>
            
            <div className="my-2 flex items-center param-item">
              <button onClick={onSubmit} className="mr-2 submit-metadata">Submit</button>
            </div>
          </div>
          
          {responseData && (
            <div className="process-metadata">
              <button onClick={onCreateProcess}>
                Create process
              </button>
              
              <DropdownButton
                title="Show data"
                key={variant}
                id={`dropdown-variants-${variant}`}
                variant={variant.toLowerCase()}
              >
                <pre className="mt-4 p-4 border">{JSON.stringify(responseData, null, 2)}</pre>
              </DropdownButton>
            </div>
          )}
        </DropdownButton>
      </div>
    );
  } else {
    return (<div></div>)
  }
};
