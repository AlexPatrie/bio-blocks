import React from "react";
import {BigraphNodeData, FormattedComposition} from "./datamodel";
import {CustomNodeType} from "./components/nodes";
import {CustomEdgeType} from "./components/edges";
import JSZip from "jszip";


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


export type FlowRepresentation = object;  // TODO: update this!

export function compileFlow(nodes: CustomNodeType[], edges: CustomEdgeType[]) {
  return {  // translation of process bigraph spec to bio blocks upload
    nodes: nodes.map((node: CustomNodeType) => ({
      id: node.id,
      data: node.data as BigraphNodeData,
    })),
    edges: edges.map((edge: CustomEdgeType) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
    })),
  };
}

export function compileComposition(nodes: CustomNodeType[]): FormattedComposition {
  // convert BigraphNodeData (which has nodeId) to formatted node ingest-able by process-bigraph
  const compositionSpec: FormattedComposition = {};
  
  // only include bigraph nodes
  nodes.forEach((node: CustomNodeType) => {
    const nodeFields = Object.keys(node.data);
    if (!nodeFields.includes('connections')) {
      const nodeData = node.data as BigraphNodeData;
      const nodeId = nodeData.nodeId as string;
      compositionSpec[nodeId] = {
        _type: nodeData._type,
        address: nodeData.address,
        config: nodeData.config,
        inputs: nodeData.inputs,
        outputs: nodeData.outputs
      };
    }
  });
  
  return compositionSpec;
}

export function writeComposition(flowRepresentation: FlowRepresentation, compositionSpec: FormattedComposition, compositionName: string) {
  const zip = new JSZip();
  zip.file("blocks.json", JSON.stringify(flowRepresentation, null, 2));
  zip.file("bigraph.json", JSON.stringify(compositionSpec, null, 2));
  zip.generateAsync({ type: "blob" }).then((content) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${compositionName}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    alert("Graph and metadata exported as composition.zip!");
  });
}

export function downloadComposition(data: any, filename: string){
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
