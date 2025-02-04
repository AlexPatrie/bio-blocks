import React from "react";
import {FormattedComposition} from "./datamodel";


export const uploadComposition = (
  event: React.ChangeEvent<HTMLInputElement>,
  onSuccess: (data: FormattedComposition) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const jsonData: FormattedComposition = JSON.parse(e.target?.result as string);

      let isValidSpec = true;
      Object.keys(jsonData).forEach((key: string) => {
        const uploadedNode = jsonData[key];
        if (!validateUpload(uploadedNode)) {
          isValidSpec = false;
        }
      });

      if (isValidSpec) {
        console.log("Uploaded valid data via importComposition:", jsonData);
        onSuccess(jsonData); // Call the callback function with the parsed data
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
