/* we should use contexts for parameterizing something in A that is only available in B*/

import { createContext, useContext } from "react";
import {CustomNodeType} from "./components/nodes";
import {InputPortSchema, OutputPortSchema, ProcessMetadata} from "./components/datamodel/requests";

export const NewProcessContext = createContext<Map<
  string,
  (nodeId: string, portType: string, portName: string) => void> | null>(null);

// Create a context with default empty function
export const _ProcessMetadataContext = createContext<
  (processAddress: string, inputSchema: InputPortSchema, outputSchema: OutputPortSchema) => void
>(() => {});


// Create a context with default empty function
export const FromMetadataContext = createContext<Map<
  string,
  (processMetadata: ProcessMetadata) => void> | null>(null);
