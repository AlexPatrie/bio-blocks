import React, { useState } from "react";
import { BigraphSpec } from "../data_model";

interface  UploadSpecProps {
  onLoadGraph: (data: BigraphSpec) => void;
}

const UploadSpec: React.FC<UploadSpecProps> = ({ onLoadGraph }: UploadSpecProps) => {
  const [jsonData, setJsonData] = useState<BigraphSpec | null | any>(null);

  const handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // Parse JSON content
        const parsedData: BigraphSpec = JSON.parse(content);

        // Validate the JSON shape
        if (isValidSpec(parsedData)) {
          setJsonData(parsedData);
          console.log("Parsed JSON data:", parsedData);
        } else {
          console.error("Invalid JSON structure");
          alert("Uploaded file does not match the expected format!");
        }
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to parse JSON file.");
      }
    };

    reader.readAsText(file);
  };

  // spec validator TODO: update this to expand to more than just data
  const isValidSpec = (data: any): data is BigraphSpec => {
    return (
      data
      // &&
      // Array.isArray(data.nodes) &&
      // Array.isArray(data.edges) &&
      // data.nodes.every((node) => "id" in node && "data" in node) &&
      // data.edges.every((edge) => "id" in edge && "source" in edge && "target" in edge)
    );
  };

  // return (
  //   <div className="p-4">
  //     <h2 className="text-lg font-bold mb-2">Upload JSON File</h2>
  //     <input
  //       type="file"
  //       accept=".json"
  //       onChange={handleFileUpload}
  //       className="mb-4"
  //     />
  //     {jsonData && (
  //       <div className="mt-4 p-2 border rounded bg-gray-50">
  //         <h3 className="text-md font-semibold">Uploaded JSON Data:</h3>
  //         <pre>{JSON.stringify(jsonData, null, 2)}</pre>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div style={{ position: "absolute", top: 0, right: 200 }}>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
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
