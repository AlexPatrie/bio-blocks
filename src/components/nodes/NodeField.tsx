import React, {useCallback, useState} from "react";
import {BigraphNode, BigraphNodeKey} from "../../data_model";


interface NodeFieldProps {
  data: BigraphNode;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>, field: keyof BigraphNode) => void;
  field: string | BigraphNodeKey;
}

export function NodeField({ data, handleInputChange, field }: NodeFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(data.nodeId || ""); // Local state for editing

  const handleBlur = useCallback(() => {
    setEditMode(false); // Exit edit mode when losing focus
    handleInputChange({ target: { value: tempValue } } as React.ChangeEvent<HTMLInputElement>, field as BigraphNodeKey); // Update parent state
  }, [tempValue, handleInputChange, field]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setEditMode(false); // Exit edit mode on Enter
        handleInputChange({ target: { value: tempValue } } as React.ChangeEvent<HTMLInputElement>, field as BigraphNodeKey); // Update parent state
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
          onBlur={handleBlur} // Save changes on blur
          onKeyDown={handleKeyDown} // Save changes on Enter
          autoFocus // Automatically focus the input when entering edit mode
          placeholder="Enter node name"
        />
      ) : (
        <h3 onClick={() => setEditMode(true)} style={{ cursor: "pointer" }}>
          {data.nodeId || "Untitled Node"}
        </h3>
      )}
    </div>
  );
}
