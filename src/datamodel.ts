import type {
  Edge, Node,
  Node as XyzFlowNode,
  NodeProps,
  NodeTypes
} from "@xyflow/react";


/* base models for nodes and stores */

export type Port = Record<string, string[]>;

// base node type
export type BaseNode = {
  nodeId: string
}

// base type for process and step nodes
export type BigraphNode =  BaseNode & {
  _type: string;
  address: string;
  config: Record<string, any>;
  inputs: Port | Record<string, string[]>;
  outputs: Port | Record<string, string[]>;
} & {
  [key: string]: any; // allows indexing with a string
};

export type ProcessNode = BigraphNode;

export type StepNode = BigraphNode;

// data stores (input and output ports)
export type StoreNode = BaseNode & {
  value: string[],
  connections?: string[]  // this field is used to keep track of node-store connection-state
} & {
  [key: string]: any;
}

// overall composition type representing the "document" that is given to Composite(config={'state': ...})
export type Composition = {
  [key: string]: BigraphNode | ProcessNode | StepNode;
}

// used for indexing node dynamically in event listeners
export type BigraphNodeKey = keyof BigraphNode | keyof ProcessNode | keyof StepNode;

export type BigraphNodePortKey = "inputs" | "outputs";

export type StoreNodePortKey = keyof StoreNode;


/* react-flow-specific interface fulfillment */

// react flow-specific interface fulfillment for process and step nodes
export type BigraphFlowNode = XyzFlowNode<ProcessNode> | XyzFlowNode<StepNode>;

// react flow-specific interface fulfillment for data stores
export type StoreFlowNode = XyzFlowNode<StepNode>;

// high-level type for easily/iteratively getting react flow-specific data
export type BaseFlowNodeConfig = {
  id: string,
  type: string,
  position: {
    x: number,
    y: number
  },
  data: StoreNode | ProcessNode | StepNode | BigraphNode
}

export type ProcessFlowNodeConfig = BaseFlowNodeConfig & {
  data: ProcessNode
}

export type StepFlowNodeConfig = BaseFlowNodeConfig & {
  data: StepNode
}

export type StoreFlowNodeConfig = BaseFlowNodeConfig & {
  data: StoreNode
}

export type NodePosition = {
  x: number,
  y: number
}


/* spec models consumed by the client */

// process/step/store spec types with nodeId omitted (in the proper format for export)
export type FormattedNode = Omit<BigraphNode | StepNode | ProcessNode | StoreNode, "nodeId">;

export type FormattedBigraphNode = FormattedNode;

export type FormattedStoreNode = FormattedNode;

// this is the actual type that is used to import/export documents to the client
export type FormattedComposition = {
  [key: string]: FormattedBigraphNode | FormattedStoreNode;
}


/*** bigraph edges (mostly cosmetic) ***/
type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;

export type DataEdge<T extends Node = Node> = Edge<{
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

// type used to add a new FlowEdge (data edge)
export type FlowEdgeConfig = {
  id: string;
  type: string;
  source: string;
  target: string;
  animated: boolean;
}



