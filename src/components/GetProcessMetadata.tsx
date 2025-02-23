import React, {useCallback, useContext, useState} from "react";
import ComposeService from "../services/ComposeService";
import GenericDropdownButton, {DropdownItem} from "./GenericDropdownButton";
import { Dropdown } from "react-bootstrap";
import {DropdownItem as BootstrapDropdownItem} from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import {InputPortSchema, OutputPortSchema, ProcessMetadata, StateData} from "./datamodel/requests";
import DataDropdown from "./DataDropdown";
import { FromMetadataContext } from "../contexts/FromMetadataContext";


// TODO: add logic for creating a new process node parameterized by the data returned here

type GetProcessMetadataProps = {
  processFromMetadata: (processMetadata: Record<string, string> | (Record<string, any> & {
    process_address: string;
    input_schema: InputPortSchema;
    output_schema: OutputPortSchema;
    initial_state: Record<string, any>;
    id?: string;
    state?: StateData
  }) | Record<string, any> | null) => void;
}

export default function GetProcessMetadata({ processFromMetadata }: GetProcessMetadataProps) {
  const [render, setRender] = useState(true);
  const [processId, setProcessId] = useState<string>("simple-membrane-process");
  const [returnCompositeState, setReturnCompositeState] = useState<boolean>(true);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [genericFile, setGenericFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<ProcessMetadata | Record<string, any> | null>(null);
  const [buttonItems, setButtonItems] = useState<DropdownItem[]>([]);
  
  const service = new ComposeService();
  
  const onCreateProcess = useContext(FromMetadataContext);
  
  const createProcess = useCallback(() => {
    if (responseData) {
      console.log("Calling create process in getmetadata")
      onCreateProcess(responseData);
    } else {
      console.log("response data not available")
    }
  }, [onCreateProcess]);
  
  const toggleRender = useCallback((event: React.MouseEvent) => {
    setRender((prev) => !prev);
  }, [setRender])
  
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
  
  const onError = (error: string) => {
    console.error(error);
    alert(`The following error occurred while processing your data: ${ error }`);
  }
  
  const onSubmit = useCallback(() => {
    service.submitProcessMetadata(configFile, genericFile, processId, returnCompositeState)
      .then((response) => {
        if (response) {
          // set response data
          console.log(`Got the response for metadata: ${Object.keys(response)}`)
          setResponseData((prevData: any) => {
            return {
              ...prevData,
              response
            }
          });
          
          // set button data
          let newData: DropdownItem[] = [];
          Object.keys(response).forEach((key: string) => {
            const item: DropdownItem = { data: response }
            newData.push(item);
          });
          setButtonItems((prevItems: DropdownItem[]) => {
            return newData;
          });
          console.log(`Now items: ${buttonItems}`)
        }
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }, [configFile, genericFile, processId, setResponseData, returnCompositeState]);
  
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
                value={processId}
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
            
            {responseData && (
              <button onClick={createProcess}>Create process</button>
            )}
          </div>
          
          
          
          <div className="process-metadata">
            {responseData && (
              <pre className="mt-4 p-4 border">{JSON.stringify(responseData, null, 2)}</pre>
            )}
          </div>
        </DropdownButton>
      </div>
    );
  } else {
    return (<div></div>)
  }
};
