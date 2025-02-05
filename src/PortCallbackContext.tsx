import { createContext, useContext } from "react";

export const PortCallbackContext = createContext<Map<string, (nodeId: string, portType: string, portName: string) => void> | null>(null);
