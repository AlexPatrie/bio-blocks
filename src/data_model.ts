import type { Edge, Node, NodeProps } from "@xyflow/react";

/*** bigraph nodes ***/
export type BigraphNode = {
  _type: string | any;
  address: string | any;
  inputs: Record<string, string[]>;
  outputs: Record<string, string[]>;
  config: Record<string, string | number | string[] | number[]>;
  nodeId?: string;
};

export type BigraphNodeKey = "_type" | "address" | "inputs" | "outputs" | "config" | "nodeId";

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
