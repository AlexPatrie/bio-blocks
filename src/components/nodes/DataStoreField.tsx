/* This component serves to handle and render the logic for a single atomic, editable attribute of a given node, ie: inputs, outputs */

import React, {useCallback, useState} from "react";
import {DataStore} from "../../data_model";


interface DataStoreFieldProps {
  data: DataStore;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  field: string;
}

export function DataStoreField({ data, handleInputChange, field }: DataStoreFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(data[field] || ""); // Local state for editing
  
  const handleBlur = useCallback(() => {
    setEditMode(false); // exit edit mode when losing focus
    handleInputChange({ target: { value: tempValue[0] } } as React.ChangeEvent<HTMLInputElement>, field); // Update parent state
  }, [tempValue, handleInputChange, field]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setEditMode(false); // Exit edit mode on Enter
        handleInputChange({ target: { value: tempValue[0] } } as React.ChangeEvent<HTMLInputElement>, field); // Update parent state
      }
    },
    [tempValue, handleInputChange, field]
  );

  return (
    <div>
      {editMode ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)} // Update local state as the user types
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Enter field"
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {data[field] || `Empty field for ${field}`}
        </h3>
      )}
    </div>
  );
}
