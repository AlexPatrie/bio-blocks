import React, {useCallback, useState} from "react";
import ComposeService from "../services/ComposeService";
import GenericDropdownButton, {DropdownItem} from "./GenericDropdownButton";
import { Dropdown } from "react-bootstrap";
import {DropdownItem as BootstrapDropdownItem} from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import {ProcessMetadata} from "./datamodel/requests";
import DataDropdown from "./DataDropdown";


export default function GetProcessMetadata() {
  const [render, setRender] = useState(true);
  const [processId, setProcessId] = useState<string>("simple-membrane-process");
  const [returnCompositeState, setReturnCompositeState] = useState<boolean>(true);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [genericFile, setGenericFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<ProcessMetadata | Record<string, any>>({});
  const [buttonItems, setButtonItems] = useState<DropdownItem[]>([]);
  
  const service = new ComposeService();
  
  const toggleRender = useCallback((event: React.MouseEvent) => {
    setRender((prev) => !prev);
  }, [setRender])
  
  const onFileChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: File | null) => void) => {
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
        }
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }, [configFile, genericFile, processId, setResponseData, returnCompositeState]);
  
  if (render) {
    return (
      <div className="p-4">
        <DropdownButton title={"Get Info"}>
          <BootstrapDropdownItem>
          <div className="param-items">
            <div className="my-2 param-item">
              <label className="block font-semibold">Config JSON File:</label>
              <input type="file" accept=".json" onChange={onConfigFileChange} className="border p-2" />
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
          </div>
          </BootstrapDropdownItem>
          
          <BootstrapDropdownItem>
            {responseData && (
              <pre className="mt-4 p-4 border">{JSON.stringify(responseData, null, 2)}</pre>
            )}
          </BootstrapDropdownItem>
        </DropdownButton>
      </div>
    );
  } else {
    return (<div></div>)
  }
};
