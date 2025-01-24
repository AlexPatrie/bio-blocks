import type {
  Edge,
  Node as FlowNode,
  NodeProps
} from "@xyflow/react";


export type CompositionNode = {
  nodeId?: string;
  _type: string;
  address: string;
  config: Config[];
  inputs: Port[];
  outputs: Port[];
};

export interface ICompositionNode {
  nodeId?: string;
  _type: string;
  address: string;
  config: Config[];
  inputs: Port[];
  outputs: Port[];
  verifyPorts(ports: Port[]): boolean;  // either input or output ports as args
}

export type Config = {
  [key: string]: any;
}

export type Port = {
  name: string;
  store: Store;
}

export interface Store {
  value: any;
  connections: Connection[];
}

export type Connection = {
  node: CompositionNode;
  direction: Direction | string;
}

export type Direction = "in" | "out";

// consumed by the client
export type CompositionNodeSpec = Omit<CompositionNode, "nodeId">;

export type CompositionNodeKey = "_type" | "address" | "inputs" | "outputs" | "config" | "nodeId";

export type CompositionState = {
  [key: string]: CompositionNode | CompositionNodeSpec | string | number;
}

export type CompositionSpec = {
  state: CompositionState;
  composition: string;
}

export type CompositionFlowNode = FlowNode<CompositionNode> | FlowNode<CompositionNodeSpec>;


/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;
