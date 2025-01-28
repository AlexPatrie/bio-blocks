/* This component serves to handle and render the logic for a single atomic, editable attribute of a given node, ie: inputs, outputs */

import React, {useCallback, useState} from "react";
import {BigraphNode, StoreNode, NodeKey} from "../../datamodel";


interface StoreNodeInputFieldProps {
  data: StoreNode;
  portName: string;
  // handleInputChange: (
  //   keyEvent: React.KeyboardEvent<HTMLInputElement>,
  //   // changeEvent: React.ChangeEvent<HTMLInputElement> | null,
  // ) => void;
}

export function StoreNodeField({ data, portName }: StoreNodeInputFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(data[portName]); // local state for editing
  
  // get original value
  const originalValue = data[portName];
  
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
      if (originalValue !== tempValue) {
        data[portName] = tempValue;
      }
    }
  }, []);
  
  return (
    <div>
      {editMode ? (
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempValue(tempValue)} // Update local state as the user types
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Enter store field"
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {data[portName]}
        </h3>
      )}
    </div>
  );
}
