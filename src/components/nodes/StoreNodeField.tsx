/* generic field component that can be used by either node type */

import React, {useCallback, useState} from "react";
import {BigraphNodeData, StoreNodeData, NodeKey, ObjectNodeData, ObjectNode} from "../datamodel/flow";


interface StoreNodeFieldProps {
  data: ObjectNodeData;
  setNodeData: (data: (prevData: ObjectNodeData) => {
    [p: string]: any;
    nodeId: string;
    value: string[];
    connections?: string[] | any[];
    valueType?: string
  }) => void;
}

export function StoreNodeField({ data, setNodeData }: StoreNodeFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [currentValue, setValue] = useState<string[]>(data.value); // local state for editing
  const [inputValue, setInputValue] = useState(currentValue[0] || "");
  
  // get original value
  const originalValue = data.value;
  
  const handleInputChange = useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Setting input change in store node field.')
    const newValue = changeEvent.target.value;
    setInputValue(newValue);
    setNodeData((prevData: ObjectNodeData) => {
      return {
        ...prevData,
        value: [newValue]
      }
    });
  }, [setInputValue, setNodeData]);
  
  const handleBlur = useCallback(() => {
    // exit edit mode when losing focus and DO NOT accept input change
    setEditMode(false);
  }, []);
  
  const handleKeyDown = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
      if (keyEvent.key === "Enter") {
        console.log('Enter clicked in store node field')
        setValue([inputValue]);
        setEditMode(false);
      }
    },
    [inputValue]
  );
  
  return (
    <div>
      {editMode ? (
        <input
          type="text"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={inputValue}
          autoFocus
          placeholder="Enter field"
          onChange={handleInputChange}
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {currentValue[0] || "Click to edit"}
        </h3>
      )}
    </div>
  );
}
