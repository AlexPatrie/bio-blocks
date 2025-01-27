import React from "react";


export const importComposition = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  let isValidSpec = true;
  reader.onload = (e) => {
    try {
      // parse the input json
      const jsonData = JSON.parse(e.target?.result as string);
      // iterate over the keys (node names) then iterate over the node.
      Object.keys(jsonData).forEach((key: string) => {
        const uploadedNode = jsonData[key];
        isValidSpec = validateUpload(uploadedNode);
      });
      // validate and set the data
      if (isValidSpec) {
        // setData(jsonData);  HERE setData should create new node elements (html)
        console.log("Uploaded and parsed data:", jsonData);
      } else {
        alert("Invalid JSON structure!");
      }
    } catch (err) {
        console.error("Error reading or parsing file:", err);
        alert("Invalid JSON file!");
      }
    };
  
  reader.readAsText(file);
};

export const exportComposition = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function validateUpload(data: object): boolean {
  // this method validates a single node from a user-uploaded composition simply by checking for the presense of a type and address field.
  const dataAttributes: string[] = Object.keys(data);
  const hasType = dataAttributes.includes('_type');
  const hasAddress = dataAttributes.includes('address');
  const hasInputs = dataAttributes.includes('inputs');
  const hasOutputs = dataAttributes.includes('outputs');
  return (
    hasType && hasAddress && hasInputs && hasOutputs
  )
}
