import type { BuiltInNode, NodeTypes, Node as BaseFlowNode } from "@xyflow/react";

import { BigraphNode } from "./BigraphNode";
import {StoreNode} from "./StoreNode";
import {ObjectNode} from "./ObjectNode";
import {
  BigraphNode as BigraphFlowNode,
  StoreNode as StoreFlowNode,
  ObjectNode as ObjectFlowNode,
} from "../datamodel/flow";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "bigraph-node": BigraphNode,  // ConstructBigraphNode
  "store-node": StoreNode,
  "object-node": ObjectNode,
  // add any of your custom nodes here!
} satisfies NodeTypes;

// append the types of your custom edges to the BuiltInNode type
export type CustomNodeType = BaseFlowNode | BuiltInNode | PositionLoggerNodeType | BigraphFlowNode | StoreFlowNode | ObjectFlowNode;
