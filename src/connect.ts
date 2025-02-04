import { Connection } from "@xyflow/react";
import {
  StoreNodeData as StoreNode,
  FlowEdgeConfig, FlowNodeConfig, BigraphNodeData as BigraphNode, NodeKey, FlowNodePosition
} from "./datamodel";


/* setters for stores and nodes */

export function addBigraphNodePort(node: BigraphNode, portKey: NodeKey | string, portName: string): void {
  // this function adds a new port to either node.inputs or node.outputs (specified by portKey) with the name=portName and the required [..._store] definition
  node[portKey][portName] = [`${portName}_store`];
}

export function addStoreNodePort(node: StoreNode, portKey: NodeKey | string, portName: string): void {
  node[portKey] = portName;
}

// getter for auto-finding the stores to create for each nodes input/output ports
export function getNodeStoreConfigs(node: BigraphNode): FlowNodeConfig[] {
  // iterate over inputs
  const inputConfigs: FlowNodeConfig[] = []
  Object.keys(node.inputs).forEach((inputKey) => {
    const storeId = `input-${inputKey}`
    const inputStore: StoreNode = {
      nodeId: storeId,
      value: node.inputs[inputKey],
    };
    
    const inputStoreConfig = newStoreNodeConfig(`${inputStore.nodeId}-store`, inputStore);
    inputConfigs.push(inputStoreConfig);
  });
  
  // iterate over outputs
  const outputConfigs: FlowNodeConfig[] = []
  Object.keys(node.outputs).forEach((outputKey) => {
    const storeId = `output-${outputKey}`
    const outputStore: StoreNode = {
      nodeId: storeId,
      value: node.outputs[outputKey],
    };
    
    const outputStoreConfig = newStoreNodeConfig(`${outputStore.nodeId}-store`, outputStore);
    outputConfigs.push(outputStoreConfig);
  });
  
  return [...inputConfigs, ...outputConfigs];
}


/* spec/type verification methods */

// callback used to verify the Connection instance returned/parameterized by the addEdge prop in Flow
export const verifyConnection = (connection: Connection): boolean => {
  console.log('This is the connection: ', JSON.stringify(connection, null, 2));
  return true;
}

export function newFlowNodeConfig(flowTypeId: string, data: BigraphNode | StoreNode, nodeId: string): FlowNodeConfig {
  const nodePosition = randomPosition();
  return {
    id: nodeId,
    type: flowTypeId,
    position: nodePosition,
    data: data
  }
}

export function newBigraphNodeConfig(nodeId?: string, data?: BigraphNode): FlowNodeConfig {
  const id = nodeId ? nodeId: `bigraph-node-${Math.random()}`
  const emptyNode: BigraphNode = {
    nodeId: id,
    _type: "process",
    address: "None",
    config: {},
    inputs: {},
    outputs: {},
  }
  return newFlowNodeConfig(
    "bigraph-node",
    data ? data: emptyNode,
    id
  );
}

export function newStoreNodeConfig(nodeId?: string, data?: StoreNode): FlowNodeConfig {
  const id = nodeId ? nodeId: `store-node-${Math.random()}`
  
  return newFlowNodeConfig(
    'store-node',
    data ? data : { nodeId: id, value: ["empty_store"], connections: [] },
    id
  );
}

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}

const randomCoordinate = (min?: number, max?: number): number => {
  min = min ? min : randomInRange(Math.random() + Math.random(), Math.random() + Math.random());
  max = max ? max : randomInRange(Math.random() + Math.random(), Math.random() + Math.random());
  return randomInRange(min, max) * (max - min) + min;
};

export function randomPosition(minX?: number, maxX?: number, minY?: number, maxY?: number): FlowNodePosition {
  return {
    x: randomCoordinate(minX, maxX),
    y: randomCoordinate(minY, maxY),
  }
}

export function newEdgeConfig(id: string, type: string, source: string, target: string, animated: boolean = true): FlowEdgeConfig {
  return {
    id: id,
    type: type,
    source: source,
    target: target,
    animated: animated,
  }
}

