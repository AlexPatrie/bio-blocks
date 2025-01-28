/* generic field component that can be used by either node type */

import React, {useCallback, useState} from "react";
import {BigraphNode, StoreNode, NodeKey} from "../../datamodel";


interface NodeFieldProps {
  data: BigraphNode | StoreNode;
  portName: string;
  // handleInputChange: (
  //   keyEvent: React.KeyboardEvent<HTMLInputElement>,
  //   // changeEvent: React.ChangeEvent<HTMLInputElement> | null,
  // ) => void;
}

export function NodeField({ data, portName }: NodeFieldProps) {
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
  {/*onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempValue(tempValue)} // Update local state as the user types*/}
  return (
    <div>
      {editMode ? (
        <input
          type="text"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Enter field"
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {data[portName]}
        </h3>
      )}
    </div>
  );
}
