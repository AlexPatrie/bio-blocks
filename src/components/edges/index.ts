import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ConstructButtonEdge from "./ButtonEdge";
import { type ButtonEdge as ButtonEdgeType } from "../../data_model";

export const initialEdges = [
  { id: "a->b", source: "a", target: "b", animated: true, type: 'button-edge' },
  { id: "b->c", source: "b", target: "c", animated: true, type: 'button-edge' },
  { id: "c->a", source: "c", target: "a", animated: true, type: "button-edge" },
] satisfies Edge[];

export const edgeTypes = {
  // add your custom edge types here!
  "button-edge": ConstructButtonEdge,
} satisfies EdgeTypes;

// append the types of you custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
