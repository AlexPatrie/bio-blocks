import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ConstructButtonEdge from "./ButtonEdge";
import { type ButtonEdge as ButtonEdgeType } from "../../data_model";

export const initialEdges = [
  { id: "ODE->FBA", source: "ODE", target: "FBA", animated: true, type: 'button-edge' },
  { id: "FBA->particle", source: "FBA", target: "particle", animated: true, type: 'button-edge' },
  { id: "particle->ODE", source: "particle", target: "ODE", animated: true, type: "button-edge" },
] satisfies Edge[];

export const edgeTypes = {
  // add your custom edge types here!
  "button-edge": ConstructButtonEdge,
} satisfies EdgeTypes;

// append the types of you custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
