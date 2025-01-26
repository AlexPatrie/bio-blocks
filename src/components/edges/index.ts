import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ConstructButtonEdge from "./ButtonEdge";
import { type ButtonEdge as ButtonEdgeType } from "../../data_model";

export const edgeTypes = {
  // add your custom edge types here!
  "button-edge": ConstructButtonEdge,
} satisfies EdgeTypes;

// append the types of you custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
