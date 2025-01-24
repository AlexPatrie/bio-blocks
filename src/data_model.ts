import type { Edge, Node, NodeProps } from "@xyflow/react";

export type DataStore = {
  [key: string]: string;
}

export type DataStoreFlowNode = Node<DataStore>;

export type Store = {
  value: any[];
  connections?: BigraphNode[];
}

export type Port = {
  name: string;
  store: Store;
}

export type BigraphNode = {
  nodeId?: string;
  _type: string;
  address: string;
  config: Record<string, string | number | string[] | number[]>;
  inputs: Record<string, Port> | Record<string, any[]>;
  outputs: Record<string, Port> | Record<string, any[]>;
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


/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;
