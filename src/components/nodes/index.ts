import type { BuiltInNode, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";
import { FlowNodeType, BigraphFlowNodeType } from "../../datamodel";
import { BigraphNode } from "./BigraphNode";
import { ProcessNode } from "./ProcessNode";
import { StepNode } from "./StepNode";
import {StoreNode} from "./StoreNode";


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "bigraph-node": BigraphNode,  // ConstructBigraphNode
  "process-node": ProcessNode,
  "step-node": StepNode,
  "store-node": StoreNode,
  // add any of your custom nodes here!
} satisfies NodeTypes;

// append the types of you custom edges to the BuiltInNode type
export type CustomNodeType = BuiltInNode | PositionLoggerNodeType | FlowNodeType | BigraphFlowNodeType;
