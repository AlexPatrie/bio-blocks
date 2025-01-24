import type { BuiltInNode, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";
import { FlowNodeType } from "../../datamodel";
import { BigraphNode } from "./BigraphNode";


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "bigraph-node": BigraphNode  // ConstructBigraphNode
  // add any of your custom nodes here!
} satisfies NodeTypes;

// append the types of you custom edges to the BuiltInNode type
export type CustomNodeType = BuiltInNode | PositionLoggerNodeType | FlowNodeType;
