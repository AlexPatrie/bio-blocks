/* This component serves to handle and render the logic for a single atomic, editable attribute of a given node, ie: inputs, outputs */

import React, {useCallback, useState} from "react";
import {NodeKeyType, NodeType, ProcessNodeType, StepNodeType, StoreNodeType} from "../../datamodel";



interface StoreFieldProps {
  storeNode: StoreNodeType;
  // @ts-ignore
  handleInputChange: (
    keyEvent: React.KeyboardEvent<HTMLInputElement> | null,
    changeEvent: React.ChangeEvent<HTMLInputElement> | null,
    field: string
  ) => void;
  field: string;
}

export function StoreField({ storeNode, handleInputChange, field }: StoreFieldProps) {
  const specifiedField = field;
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(storeNode[specifiedField]); // local state for editing
  
  const handleBlur = useCallback(() => {
    setEditMode(false); // exit edit mode when losing focus
    const inputChange = {
      target: {
        value: tempValue
      }
    }
    
    handleInputChange(null, inputChange as React.ChangeEvent<HTMLInputElement>, specifiedField); // update parent state
  }, [tempValue, handleInputChange, specifiedField]);
  
  const handleKeyDown = useCallback((keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
    if (keyEvent.key === "Enter") {
      setEditMode(false); // exit edit mode on Enter
      handleInputChange(keyEvent, null, field);
      // handleInputChange(keyEvent, { target: { value: tempValue } } as React.ChangeEvent<HTMLInputElement>, specifiedField); // Update parent state
    }
  }, [tempValue, handleInputChange, specifiedField]);
  
  const handleFocus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Pass the change event to the handler
    // handleInputChange(null, event, field);
    console.log('focused!')
    const inputChange = {
      target: {
        value: tempValue
      }
    }
    handleInputChange(null, inputChange as React.ChangeEvent<HTMLInputElement>, specifiedField);
  }, [tempValue, handleInputChange, specifiedField]);
  
  const specifiedUpdate = storeNode[specifiedField];
  const updatedData = typeof specifiedUpdate === "string" ? specifiedUpdate : JSON.stringify(Object.keys(specifiedUpdate));
  
  return (
    <div>
      {editMode ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)} // Update local state as the user types
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus
          placeholder="Enter field"
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {updatedData || `Empty field for ${specifiedField}`}
        </h3>
      )}
    </div>
  );
}

// const _handleKeyDown = useCallback(
  //   (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
  //     // here is what should trigger step 4 (entirely)
  //     if (keyEvent.key === "Enter") {
  //       setEditMode(false); // exit edit mode on Enter
  //       handleInputChange(keyEvent, { target: { value: tempValue } } as React.ChangeEvent<HTMLInputElement>, specifiedField); // Update parent state
  //     }
  //   },
  //   [tempValue, handleInputChange, specifiedField]
  // );
