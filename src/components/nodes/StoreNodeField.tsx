/* generic field component that can be used by either node type */

import React, {useCallback, useState} from "react";
import {BigraphNodeData, StoreNodeData, NodeKey} from "../../datamodel";


interface StoreNodeFieldProps {
  data: StoreNodeData | Record<string, string[]>;
  // onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) => void;
  // changeInput: (
  //   keyEvent: React.KeyboardEvent<HTMLInputElement> | null,
  //   changeEvent: React.ChangeEvent<HTMLInputElement> | null,
  // ) => void;
}

export function StoreNodeField({ data }: StoreNodeFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [currentValue, setValue] = useState<string[]>(data.value); // local state for editing
  const [inputValue, setInputValue] = useState(currentValue[0] || "");
  
  // get original value
  const originalValue = data.value;
  
  const handleInputChange = useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(changeEvent.target.value);
  }, []);
  
  const handleBlur = useCallback(() => {
    // exit edit mode when losing focus and DO NOT accept input change
    setEditMode(false);
  }, []);
  
  const handleKeyDown = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
      if (keyEvent.key === "Enter") {
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
