import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ConstructButtonEdge from "./ButtonEdge";
import {DataEdge} from "./DataEdge";
import { type ButtonEdge as ButtonEdgeType } from "../../datamodel";

export const edgeTypes = {
  // add your custom edge types here!
  "button-edge": ConstructButtonEdge,
  "data-edge": DataEdge,
} satisfies EdgeTypes;

// append the types of you custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType | DataEdge;
