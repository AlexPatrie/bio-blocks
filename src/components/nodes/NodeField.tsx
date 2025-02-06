/* generic field component that can be used by either node type */

import React, {useCallback, useEffect, useRef, useState} from "react";
import {BigraphNodeData, StoreNodeData, NodeKey} from "../../datamodel";


interface NodeFieldProps {
  data: BigraphNodeData | StoreNodeData | Record<string, string[]>;
  portName: string;
  // onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) => void;
  // changeInput: (
  //   keyEvent: React.KeyboardEvent<HTMLInputElement> | null,
  //   changeEvent: React.ChangeEvent<HTMLInputElement> | null,
  // ) => void;
}

export function NodeField({ data, portName }: NodeFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setValue] = useState(data[portName]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Auto-focus the input when edit mode is enabled
  useEffect(() => {
    if (editMode) {
      setTimeout(() => { // ⏳ Wait for the input to appear in the DOM
        if (inputRef.current) {
          console.log("Auto-focusing input!");
          inputRef.current.focus();
          inputRef.current.select(); // (Optional) Select all text
        } else {
          console.warn("inputRef.current is still null");
        }
      }, 0);
    } else {
      console.log("editMode is false");
    }
  }, [editMode]);

  
  const handleFocus = useCallback(() => {
    setIsFocused((isFocused) => {
      return true;
    });
    console.log("handleFocus", isFocused);
  }, []);
  
  const handleInputChange = useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    // data[portName] = changeEvent.target.value;
    setValue(changeEvent.target.value);
  }, []);
  
  const handleBlur = useCallback(() => {
    // exit edit mode when losing focus and DO NOT accept input change
    setEditMode(false);
  }, []);
  
  const handleKeyDown = useCallback((keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
     // this is the ONLY method by which users can confirm new fields
    if (keyEvent.key === "Enter") {
      // turn off editing mode
      setEditMode(false);
      setValue(currentValue);
      // check if new value is different from original and set if so
      // if (originalValue !== currentValue) {
      //   data[portName] = currentValue;
      // }
    }
  }, [currentValue]);

  return (
    <div className="node-field">
      {editMode ? (
        <input
          ref={inputRef}
          type="text"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          value={currentValue}
          autoFocus
          placeholder="Enter field"
          onChange={(changeEvent: React.ChangeEvent<HTMLInputElement>) => handleInputChange(changeEvent)}
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {currentValue}
        </h3>
      )}
    </div>
  );
}
