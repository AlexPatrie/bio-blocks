/* generic field component that can be used by either node type */

import React, {useCallback, useEffect, useRef, useState} from "react";
import {BigraphNodeData, StoreNodeData, NodeKey} from "../datamodel/flow";


interface NodeFieldProps {
  data: BigraphNodeData | StoreNodeData | Record<string, string[]>;
  portName: string;
  onPortValueChange?: (portName: string, newValue: string) => void;
}

export function NodeField({ data, portName, onPortValueChange }: NodeFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setValue] = useState(data[portName]);
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
  
  const handleInputChange = useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setValue(changeEvent.target.value);
  }, []);
  
  const handleKeyDown = useCallback((keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
     // this is the ONLY method by which users can confirm new fields
    if (keyEvent.key === "Enter") {
      console.log(`Setting value to : ${currentValue} for portName: ${portName}`);
      
      // turn off editing mode
      setEditMode(false);
      
      if (onPortValueChange) {
        // notify parent of value change if input or output
        onPortValueChange(portName, currentValue);
      } else {
        setValue(currentValue);
      }
    }
  }, [currentValue, onPortValueChange, portName]);

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
          onChange={handleInputChange}
          // onChange={(changeEvent: React.ChangeEvent<HTMLInputElement>) => handleInputChange(changeEvent)}
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {currentValue}
        </h3>
      )}
    </div>
  );
}
