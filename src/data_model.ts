import type { Edge, Node, NodeProps } from "@xyflow/react";

/*** bigraph nodes ***/
export type BigraphNode = {
  label: string | any;
  _type: string | any;
  address: string | any;
  inputs: Record<string, string[]> | any;
  outputs: Record<string, string[]> | any;
  config: Record<string, string> | any;
};

export type BigraphState = {
  [key: string]: BigraphNode | string | number;
}

export type BigraphSpec = {
  state: BigraphState;
  composition: string;
}

export type BigraphFlowNode = Node<BigraphNode>;


/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;
