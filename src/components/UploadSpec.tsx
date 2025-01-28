import React, { useState } from "react";
import {Composition, FormattedComposition} from "../datamodel";

interface  UploadSpecProps {
  onLoadGraph: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSpec: React.FC<UploadSpecProps> = ({ onLoadGraph }: UploadSpecProps) => {
  const [jsonData, setJsonData] = useState<FormattedComposition | null | any>(null);

  return (
    <div style={{ position: "absolute", top: 0, right: 200 }}>
      <input
        type="file"
        accept=".json"
        onChange={onLoadGraph}
        style={{
          padding: "7px 16px",
          backgroundColor: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default UploadSpec;
