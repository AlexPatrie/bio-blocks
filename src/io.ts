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
