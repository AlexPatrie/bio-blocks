import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ConstructButtonEdge from "./ButtonEdge";
import {DataEdge} from "./DataEdge";
import {
  type ButtonEdge as ButtonEdgeType,
  type DataEdge as DataEdgeType,
  type PlaceEdge as PlaceEdgeType,
} from "../datamodel/flow";
import ConstructPlaceEdge from "./PlaceEdge";

export const edgeTypes = {
  // add your custom edge types here!
  "button-edge": ConstructButtonEdge,
  "place-edge": ConstructPlaceEdge
  // "data-edge": DataEdge,
} satisfies EdgeTypes;

// append the types of you custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType | DataEdgeType | PlaceEdgeType;
