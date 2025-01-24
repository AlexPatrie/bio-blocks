import React, { useState } from "react";

type CollapsibleDropdownProps = {
  title: string;
  items: string[]; // Array of input field values
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void; // Handler function
};

const CollapsibleDropdown: React.FC<CollapsibleDropdownProps> = ({
  title,
  items,
  handleInputChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Dropdown Toggle Button */}
      <button
        onClick={toggleDropdown}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {title}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div style={{ marginTop: "8px", border: "1px solid #ddd", padding: "8px" }}>
          {items.map((portName, index) => (
            <input
              key={index}
              type="text"
              value={portName}
              onChange={(e) => handleInputChange(e, index)} // Pass index to identify which input changed
              placeholder={`output ${index + 1}`}
              style={{
                marginBottom: "8px",
                display: "block",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleDropdown;
