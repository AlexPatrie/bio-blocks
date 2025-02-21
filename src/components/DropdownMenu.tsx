import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useCallback, useEffect, useRef, useState} from "react";


export type DropdownProcessMenuProps = {
  processId: string;
  processType: string;
  processAddress: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DropdownProcessMenu({ processId, processType, processAddress, handleChange }: DropdownProcessMenuProps) {
  // TODO: add name changer
  
  const [id, setId] = useState<string>(processId);
  const [_type, setType] = useState<string>(processType);
  const [address, setAddress] = useState<string>(processAddress);
  const [editMode, setEditMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Auto-focus the input when edit mode is enabled
  useEffect(() => {
    if (editMode) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select(); // (Optional) Select all text
        } else {
          return;
        }
      }, 0);
    } else {
      // console.log("editMode is false");
      return;
    }
  }, [editMode]);

  
  const handleFocus = useCallback(() => {
    setIsFocused((isFocused) => {
      return true;
    });
    console.log("handleFocus", isFocused);
  }, []);
  
  const handleBlur = useCallback(() => {
    // exit edit mode when losing focus and DO NOT accept input change
    setEditMode(false);
  }, []);
  
  const handleIdChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value;
    setId((prevId: string) => {
      return prevId === newId ? prevId : newId;
    });
  }, [setId]);
  
  const handleTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value;
    setType((prevType: string) => {
      return prevType === newType ? prevType : newType;
    });
  }, [setType]);
  
  const handleAddressChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value;
    setAddress((prevAddress: string) => {
      return prevAddress === newAddress ? prevAddress : newAddress;
    });
  }, [setAddress]);
  
  const onClick = useCallback(() => {
    console.log('DropdownButton button item clicked');
  }, []);
  
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log(`DropdownButton button item clicked with value: ${Object.keys(event.target)}`);
    }
    
  }, [])
  
  return (
    <DropdownButton id="dropdown-basic-button" title={id} drop="up">
      <Dropdown.Item>
        <span style={{paddingRight: "1rem", fontWeight: "bolder"}}>Name:</span>
        <input
          value={id}
          onKeyDown={onKeyDown}
          onChange={handleIdChange}
          onBlur={handleBlur}
          autoFocus
          onFocus={handleFocus}
        >
        </input>
      </Dropdown.Item>
      
      <Dropdown.Item>
        <span style={{paddingRight: "1rem", fontWeight: "bolder"}}>Type:</span>
        <input value={_type} onKeyDown={onKeyDown} onChange={handleTypeChange} onBlur={handleBlur}
          autoFocus
          onFocus={handleFocus}></input>
      </Dropdown.Item>
      
      <Dropdown.Item>
        <span style={{paddingRight: "1rem", fontWeight: "bolder"}}>Address:</span>
        <input value={address} onKeyDown={onKeyDown} onChange={handleAddressChange} onBlur={handleBlur}
          autoFocus
          onFocus={handleFocus}></input>
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default DropdownProcessMenu;


// return (
//   <DropdownButton id="dropdown-basic-button" title="Basic Button">
//     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
//     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
//     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
//   </DropdownButton>
// );
