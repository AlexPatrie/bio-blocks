import type {
  Edge, Node,
  Node as XyzFlowNode,
  NodeProps, NodeTypes
} from "@xyflow/react";


export type BigraphNodeType = NodeType;

export type ProcessNodeType = BigraphNodeType;

export type StepNodeType = BigraphNodeType;

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
  connections: ConnectionType[];
} & {
  [key: string]: any;  // allows indexing with a string
}

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

export type ButtonEdge = Edge<ButtonEdgeData>;


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


// composition(process/step) node
// export type NodeType = {
//   nodeId: string;
//   _type: string;
//   address: string;
//   config: ConfigType;
//   inputs: PortType[] | Record<string, any>;
//   outputs: PortType[] | Record<string, any>;
// }
//
// // config attribute
// export type ConfigType = {
//   [key: string]: any;
// }
//
// // ports (to be verified)
// export type PortType = {
//   name: string;
//   store: StoreType;
// }
//
// export type StoreType = {
//   value: any;
//   connections: ConnectionType[];
// }
//
// export type ConnectionType = {
//   nodeId: string;
//   direction: DirectionType | string;
// }
//
// export type DirectionType = "in" | "out";
//
//
// // used for indexing node dynamically in event listeners
// export type NodeKey = "_type" | "address" | "inputs" | "outputs" | "config" | "nodeId";
//
//
// // primary flow node interface fulfillment type
// export type FlowNode = XyzFlowNode<NodeType> | XyzFlowNode<NodeSpecType>;
//
//
// /*** bigraph edges (mostly cosmetic) ***/
// type ButtonEdgeData = {};
//
// export type ButtonEdge = Edge<ButtonEdgeData>;
//
//
// // consumed by the client
// export type Spec = Record<string, any>;
//
// export type PortSpec = Record<string, string[]>;
//
// export type NodeSpecType = Omit<Node, "nodeId">;
//
// export type StateSpec = {
//   [key: string]: Node | NodeSpecType | string | number;
// }
//
// export type CompositionSpec = {
//   state: StateSpec;
//   composition: string;
// }








