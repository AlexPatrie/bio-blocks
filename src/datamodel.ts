import type {
  Edge, Node,
  Node as XyzFlowNode,
  NodeProps,
  NodeTypes
} from "@xyflow/react";
import {number} from "prop-types";


/* base models for nodes and stores */

// base data type allowing for string indexing
export type Data = {
  [key: string]: any;
};

// base node type
export type NodeData = Data & {
  nodeId: string
};

// base type for process and step nodes
export type BigraphNodeData =  NodeData & {
  _type: "process" | "step" | string;
  address: string;
  config: Record<string, any>;
  inputs: Record<string, string[]>;
  outputs: Record<string, string[]>;
}

// data stores (input and output ports)
export type StoreNodeData = NodeData & {
  value: string[],
  connections?: string[] | any[]  // this field is used to keep track of node-store connection-state
}

// overall composition type representing the "document" that is given to Composite(config={'state': ...})
export type Composition = {
  [key: string]: BigraphNodeData;
}

// used for indexing node dynamically in event listeners
type BigraphNodeKey = keyof BigraphNodeData;

type StoreNodeKey = keyof StoreNodeData;

export type NodeKey = BigraphNodeKey | StoreNodeKey | string;


/* react-flow-specific interface fulfillment */

// react flow-specific interface fulfillment for process and step nodes as well as stores
export type BigraphNode = XyzFlowNode<BigraphNodeData>;

export type StoreNode = XyzFlowNode<StoreNodeData>;

// high-level type for easily/iteratively getting react flow-specific data
export type FlowNodeConfig = {
  id: string,
  type: string,
  position: FlowNodePosition,
  data: StoreNodeData | BigraphNodeData;
}

export type FlowNodePosition = {
  x: number,
  y: number
}


/* spec models consumed by the client */

// process/step/store spec types with nodeId omitted (in the proper format for export)
export type FormattedNode = Omit<BigraphNodeData | StoreNodeData, "nodeId">;

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




