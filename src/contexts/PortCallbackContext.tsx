import { createContext, useContext } from "react";
import {CustomNodeType} from "../components/nodes";

export const NewPortCallbackContext = createContext<Map<
  string,
  (nodeId: string, portType: string, portName: string) => void> | null>(null);


// Create a context with default empty function
export const PortChangeCallbackContext = createContext<(nodeId: string, portType: string, portName: string, newValue: string) => void>(
  () => {}
);
