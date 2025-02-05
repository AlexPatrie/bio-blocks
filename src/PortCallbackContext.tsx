import { createContext, useContext } from "react";
import {CustomNodeType} from "./components/nodes";

export const PortCallbackContext = createContext<Map<
  string,
  (nodeId: string, portType: string, portName: string) => void> | null>(null);
