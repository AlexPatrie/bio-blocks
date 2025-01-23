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

export type BigraphNodeSpec = Omit<BigraphNode, "nodeId">;

export type BigraphNodeKey = "_type" | "address" | "inputs" | "outputs" | "config" | "nodeId";

export type BigraphState = {
  [key: string]: BigraphNode | BigraphNodeSpec | string | number;
}

export type BigraphSpec = {
  state: BigraphState;
  composition: string;
}

export type BigraphFlowNode = Node<BigraphNode> | Node<BigraphNodeSpec>;

// export interface DataStore {
//   [key: string]: string;
// }

export type DataStore = {
  [key: string]: string[];
}

export type DataStoreFlowNode = Node<DataStore>;

/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;
