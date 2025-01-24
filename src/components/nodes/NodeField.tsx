/* This component serves to handle and render the logic for a single atomic, editable attribute of a given node, ie: inputs, outputs */

import React, {useCallback, useState} from "react";
import {NodeKeyType, NodeType} from "../../datamodel";



interface NodeFieldProps {
  data: NodeType;
  // @ts-ignore
  handleInputChange: (keyEvent?: React.KeyboardEvent<HTMLInputElement>, changeEvent: React.ChangeEvent<HTMLInputElement>, field: string | NodeKeyType) => void;
  field: string | NodeKeyType;
}

export function NodeField({ data, handleInputChange, field }: NodeFieldProps) {
  const specifiedField = field as NodeKeyType;
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(data[specifiedField] || specifiedField); // local state for editing
  
  const handleBlur = useCallback(() => {
    setEditMode(false); // exit edit mode when losing focus
    const inputChange = {
      target: {
        value: tempValue
      }
    }
    
    handleInputChange(inputChange as React.ChangeEvent<HTMLInputElement>, specifiedField); // update parent state
  }, [tempValue, handleInputChange, specifiedField]);

  const handleKeyDown = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
      // here is what should trigger step 4 (entirely)
      if (keyEvent.key === "Enter") {
        setEditMode(false); // exit edit mode on Enter
        handleInputChange(keyEvent, { target: { value: tempValue } } as React.ChangeEvent<HTMLInputElement>, specifiedField); // Update parent state
      }
    },
    [tempValue, handleInputChange, specifiedField]
  );
  
  const specifiedUpdate = data[specifiedField];
  const updatedData = typeof specifiedUpdate === "string" ? specifiedUpdate : JSON.stringify(Object.keys(specifiedUpdate));
  
  return (
    <div>
      {editMode ? (
        <input
          type="text"
          value={typeof tempValue === "string" ? tempValue : JSON.stringify(tempValue)}
          onChange={(e) => setTempValue(e.target.value)} // Update local state as the user types
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
