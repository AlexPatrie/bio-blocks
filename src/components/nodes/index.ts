import type { BuiltInNode, NodeTypes } from "@xyflow/react";

import {BigraphFlowNode, FlowNodeConfig, StoreFlowNode} from "../../datamodel";

import { BigraphNode } from "./BigraphNode";
import {StoreNode} from "./StoreNode";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "bigraph-node": BigraphNode,  // ConstructBigraphNode
  "store-node": StoreNode,
  // add any of your custom nodes here!
} satisfies NodeTypes;

// append the types of you custom edges to the BuiltInNode type
export type CustomNodeType = BuiltInNode | PositionLoggerNodeType | BigraphFlowNode | StoreFlowNode | FlowNodeConfig;
