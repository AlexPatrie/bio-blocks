import { useState, useCallback } from "react";
import type { BigraphNode } from "../../data_model";

interface EditableNodeFieldProps {
  data: BigraphNode;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>, field: keyof BigraphNode) => void;
}

export function EditableNodeField({ data, handleInputChange }: EditableNodeFieldProps) {
  const [editMode, setEditMode] = useState(false);

  const handleBlur = useCallback(() => {
    setEditMode(false); // Exit edit mode when losing focus
  }, []);

  const handleFocus = useCallback(() => {
    setEditMode(true); // Enter edit mode when clicked or focused
  }, []);

  return (
    <div>
      {editMode ? (
        <input
          type="text"
          value={data.id || ""}
          onChange={(e) => handleInputChange(e, "id")}
          onBlur={handleBlur} // Exit edit mode when focus is lost
          autoFocus // Automatically focus the input when entering edit mode
          placeholder="Enter node name"
        />
      ) : (
        <h3 onClick={handleFocus} style={{ cursor: "pointer" }}>
          {data.id || "Untitled Node"}
        </h3>
      )}
    </div>
  );
}
