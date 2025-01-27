import type {
  Edge, Node,
  Node as XyzFlowNode,
  NodeProps, NodeTypes
} from "@xyflow/react";


export type FlowNodePosition = {
  x: number;
  y: number;
  z?: number;
}

export type StoreNodeConfig = {
  id: string,
  type: string,
  position: FlowNodePosition,
  data: StoreNodeType
}

export type BigraphNodeType = NodeType;

export type ProcessNodeType = BigraphNodeType;

export type StepNodeType = BigraphNodeType;

export type CompositionType = {
  [key: string]: BigraphNodeType | ProcessNodeType | StepNodeType;
}

export type BigraphFlowNodeType = XyzFlowNode<ProcessNodeType> | XyzFlowNode<StepNodeType> | XyzFlowNode<BigraphNodeSpecType>;

export type BigraphNodeSpecType = Omit<BigraphNodeType, "nodeId">;

export type StoreNodeType = {
  value: any;
  connections: ConnectionType[];
} & {
  [key: string]: any;
}

// base node type
export type NodeType = {
  nodeId: string;
  _type: string;
  address: string;
  config: Record<string, any>;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
} & {
  [key: string]: any; // allows indexing with a string
};

// config attribute
export type ConfigType = {
  [key: string]: any;
}

// ports (to be verified)
export type PortType = {
  name: string;
  store: StoreType;
} & {
  [key: string]: any; // allows indexing with a string
};

export type StoreType = {
  value: any;
  connections: Connection[];
} & {
  [key: string]: any;  // allows indexing with a string
}

export type Connection = {
  nodeId: string;
  direction: DirectionType | string;
};

export type ConnectionType = {
  nodeId: string;
  direction: DirectionType | string;
}

export type DirectionType = "in" | "out";


// used for indexing node dynamically in event listeners
export type NodeKeyType = "_type" | "address" | "inputs" | "outputs" | "config" | "nodeId";


// primary base flow node interface fulfillment type
export type FlowNodeType = XyzFlowNode<NodeType> | XyzFlowNode<NodeSpecType>;


/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

type DataEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData> | Edge<DataEdgeData> | Edge<DataEdgeType>;

export type DataEdgeType<T extends Node = Node> = Edge<{
  /**
   * The key to lookup in the source node's `data` object. For additional safety,
   * you can parameterize the `DataEdge` over the type of one of your nodes to
   * constrain the possible values of this key.
   *
   * If no key is provided this edge behaves identically to React Flow's default
   * edge component.
   */
  key?: keyof T["data"];
  /**
   * Which of React Flow's path algorithms to use. Each value corresponds to one
   * of React Flow's built-in edge types.
   *
   * If not provided, this defaults to `"bezier"`.
   */
  path?: "bezier" | "smoothstep" | "step" | "straight";
}>;

// consumed by the client
export type SpecType = Record<string, any>;

export type PortSpecType = Record<string, string[]>;

export type NodeSpecType = Omit<NodeType, "nodeId">;

export type StateSpecType = {
  [key: string]: NodeType | NodeSpecType | string | number;
}

export type CompositeSpecType = {
  state: StateSpecType;
  composition: string;
}

export type AppNode = {
  id: string,
  type: string,
  position: {
    x: number,
    y: number
  },
  data: any
};

export type AppEdge = {
  id: string,
  type: string,
  source: string,
  target: string,
  animated: boolean,
};





