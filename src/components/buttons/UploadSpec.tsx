import React, { useState } from "react";
import {Composition, FormattedComposition} from "../datamodel/flow";
import Button from "react-bootstrap/Button";

interface  UploadSpecProps {
  onLoadGraph: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSpec: React.FC<UploadSpecProps> = ({ onLoadGraph }: UploadSpecProps) => {
  const [jsonData, setJsonData] = useState<FormattedComposition | null | any>(null);

  return (
    <div>
      <Button variant="outline-success" key="success">
        <input
        type="file"
        accept=".json"
        onChange={onLoadGraph}
        style={{
          padding: "7px 16px",
          // backgroundColor: "#198754",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
      </Button>
      
    </div>
  );
};

export default UploadSpec;
