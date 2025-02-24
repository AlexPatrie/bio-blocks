import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useCallback, useState} from "react";
import {ProcessMetadata} from "../datamodel/requests";

export type DropdownItem = {
  href?: string;
  data?: any;
};

export type DropdownButtonProps = {
  title: string;
  items: DropdownItem[];
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  responseData?: ProcessMetadata;
}

function GenericDropdownButton({ title, items, editable, onChange, onClick, onKeyDown }: DropdownButtonProps) {
  const editMode: boolean = editable? editable : false;
  
  const getInitialData = (): any[] => {
    const initialData: any[] = [];
    items.forEach(item => {
      if (item.data) {
        initialData.push(item.data);
      }
    });
    return initialData;
  };
  
  const initialData: any[] = getInitialData();
  
  const [buttonTitle, setButtonTitle] = useState<string>(title);
  const [buttonItems, setButtonItems] = useState<DropdownItem[]>(items);
  const [isEditable, setIsEditable] = useState<boolean>(editMode);
  const [data, setData] = useState<any[]>(initialData);
  
  const handleDataChange = !onClick
    ? useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setData((currentData: any[]) => {
          const inputData: any[] = JSON.parse(event.target.value);
          return inputData !== currentData ? inputData : currentData;
        })
    }, [setData])
    : onClick;
  
  const handleKeyDown = !onClick
    ? useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key.toLowerCase() === "enter") {
          const inputValue = (event.target as HTMLInputElement).value;
        
        }
    }, [setData])
    : onKeyDown;
  
  // TODO: add name changer
  
  const toggleEditMode = useCallback(() => {
    setIsEditable((modeState: boolean) => {
      return !modeState
    });
  }, [setIsEditable]);
  
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={title}
      onChange={!onChange ? (event: React.ChangeEvent<HTMLInputElement>) => {} : onChange}
    >
      {items.map((item) => (
        <Dropdown.Item href={item.href ? item.href : ""}>
          <div className="dropdown-item-data">
            {isEditable
              ? (<input value={data} onChange={handleDataChange}></input>)
              : (<div>{data}</div>)
            }
          </div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default GenericDropdownButton;


// return (
//   <DropdownButton id="dropdown-basic-button" title="Basic Button">
//     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
//     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
//     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
//   </DropdownButton>
// );
