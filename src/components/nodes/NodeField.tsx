/* generic field component that can be used by either node type */

import React, {useCallback, useState} from "react";
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
  const [currentValue, setValue] = useState(data[portName]); // local state for editing
  
  // get original value
  const originalValue = data[portName];
  
  const handleInputChange = useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    data[portName] = changeEvent.target.value;
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
      
      // check if new value is different from original and set if so
      if (originalValue !== currentValue) {
        data[portName] = currentValue;
      }
    }
  }, []);
  {/*onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempValue(tempValue)} // Update local state as the user types*/}
  return (
    <div className="node-field">
      {editMode ? (
        <input
          type="text"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
