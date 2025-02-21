import React, {useCallback, useState} from "react";
import ComposeService from "../services/ComposeService";

const ProcessMetadataUploader = () => {
  const [processId, setProcessId] = useState<string>("simple-membrane-process");
  const [returnCompositeState, setReturnCompositeState] = useState<boolean>(true);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [genericFile, setGenericFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  
  const service = new ComposeService();
  
  const onFileChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: File | null) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      setter(event.target.files[0]);
    }
  }, []);
  
  const onConfigFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event, setConfigFile);
  }, [setConfigFile, onFileChange]);
  
  const onGenericFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event, setGenericFile);
  }, [setGenericFile, onFileChange]);
  
  const onError = (error: string) => {
    console.error(error);
    alert(`The following error occurred while processing your data: ${ error }`);
  }
  
  const onSubmit = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    service.submitProcessMetadata(configFile, genericFile, processId, setResponse, returnCompositeState)
      .catch((error: Error) => {
        console.error(error);
      })
  }, [configFile, genericFile, processId, setResponse, returnCompositeState]);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Upload Process Metadata</h2>
      
      <div className="my-2">
        <label className="block font-semibold">Config JSON File:</label>
        <input type="file" accept=".json" onChange={onConfigFileChange} className="border p-2" />
      </div>
      
      <div className="my-2">
        <label className="block font-semibold">Generic File:</label>
        <input type="file" onChange={onGenericFileChange} className="border p-2" />
      </div>

      <div className="my-2">
        <label className="block font-semibold">Process ID:</label>
        <input
          type="text"
          value={processId}
          onChange={(e) => setProcessId(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      
      <div className="my-2 flex items-center">
        <input
          type="checkbox"
          checked={returnCompositeState}
          onChange={(e) => setReturnCompositeState(e.target.checked)}
          className="mr-2"
        />
        <label>Return Composite State</label>
      </div>
      
      <button onClick={onSubmit} className="bg-blue-500 text-white p-2 rounded">
        Upload
      </button>
      
      {response && (
        <pre className="mt-4 p-4 border">{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
};

export default ProcessMetadataUploader;


// const ProcessMetadataUploader = () => {
//   const [processId, setProcessId] = useState<string>("simple-membrane-process");
//   const [returnCompositeState, setReturnCompositeState] = useState<boolean>(true);
//   const [configFile, setConfigFile] = useState<File | null>(null);
//   const [genericFile, setGenericFile] = useState<File | null>(null);
//   const [response, setResponse] = useState<any>(null);
//
//   // Handle Config File Upload
//   const handleConfigFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setConfigFile(event.target.files[0]);
//     }
//   };
//
//   // Handle Generic File Upload
//   const handleGenericFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setGenericFile(event.target.files[0]);
//     }
//   };
//
//   // Handle Upload
//   const handleUpload = async () => {
//     console.log(`Handling upload in progress`);
//     if (!configFile || !genericFile) {
//       alert("Please select both files before uploading!");
//       return;
//     }
//
//     const formData = new FormData();
//     formData.append("config", configFile); // JSON Config File
//     formData.append("model_files", genericFile); // Generic File
//     formData.append("process_id", processId);
//     formData.append("return_composite_state", String(returnCompositeState));
//
//     try {
//       const response = await fetch(
//         `${API_URL}?process_id=${encodeURIComponent(processId)}&return_composite_state=${returnCompositeState}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//
//       const data = await response.json();
//       setResponse(data);
//     } catch (error) {
//       console.error("Error uploading files:", error);
//     }
//   };
//
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold">Upload Process Metadata</h2>
//
//       {/* Config File Input */}
//       <div className="my-2">
//         <label className="block font-semibold">Config JSON File:</label>
//         <input type="file" accept=".json" onChange={handleConfigFileChange} className="border p-2" />
//       </div>
//
//       {/* Generic File Input */}
//       <div className="my-2">
//         <label className="block font-semibold">Generic File:</label>
//         <input type="file" onChange={handleGenericFileChange} className="border p-2" />
//       </div>
//
//       {/* Process ID */}
//       <div className="my-2">
//         <label className="block font-semibold">Process ID:</label>
//         <input
//           type="text"
//           value={processId}
//           onChange={(e) => setProcessId(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//
//       {/* Return Composite State Checkbox */}
//       <div className="my-2 flex items-center">
//         <input
//           type="checkbox"
//           checked={returnCompositeState}
//           onChange={(e) => setReturnCompositeState(e.target.checked)}
//           className="mr-2"
//         />
//         <label>Return Composite State</label>
//       </div>
//
//       {/* Upload Button */}
//       <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">
//         Upload
//       </button>
//
//       {/* Response Output */}
//       {response && (
//         <pre className="mt-4 p-4 border">{JSON.stringify(response, null, 2)}</pre>
//       )}
//     </div>
//   );
// };
//
// export default ProcessMetadataUploader;
