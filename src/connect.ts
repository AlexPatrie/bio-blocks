import { Connection } from "@xyflow/react";
import {
  ProcessNode,
  StepNode,
  BigraphNodePortKey,
  StoreNodePortKey,
  StoreNode,
  ProcessFlowNodeConfig,
  StepFlowNodeConfig,
  StoreFlowNodeConfig,
  FlowEdgeConfig, NodePosition
} from "./datamodel";


/* setters for stores and nodes */

export function addBigraphNodePort(node: ProcessNode | StepNode, portKey: BigraphNodePortKey, portName: string): void {
  // this function adds a new port to either node.inputs or node.outputs (specified by portKey) with the name=portName and the required [..._store] definition
  node[portKey][portName] = [`${portName}_store`];
}

export function addStoreNodePort(node: StoreNode, portKey: StoreNodePortKey, portName: string): void {
  node[portKey] = portName;
}

// getter for auto-finding the stores to create for each nodes input/output ports
export function getNodeStoreConfigs(node: ProcessNode | StepNode): StoreFlowNodeConfig[] {
  // iterate over inputs
  const inputConfigs: StoreFlowNodeConfig[] = []
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
  const outputConfigs: StoreFlowNodeConfig[] = []
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

export function newBigraphNodeConfig(nodeId: string, flowTypeId: string, x: number, y: number, data: ProcessNode | StepNode): ProcessFlowNodeConfig | StepFlowNodeConfig {
  return {
    id: nodeId,
    type: flowTypeId,
    position: {
      x: x,
      y: y
    },
    data: data
  }
}

export function newStoreNodeConfig(nodeId: string, data: StoreNode): StoreFlowNodeConfig {
  const storePosition = newNodePosition();
  return {
    id: nodeId,
    type: "store-node",
    position: storePosition,
    data: data
  }
}

function newNodePosition(): NodePosition {
  // TODO: dynamically set min/max values according to DOM state
  const minX = -(Math.random());
  const maxX = Math.random();
  const minY = -(Math.random());
  const maxY = Math.random();
  
  return generateRandomPosition(minX, maxX, minY, maxY);
}

function generateRandomPosition(minX: number, maxX: number, minY: number, maxY: number): NodePosition {
  const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  return {
    x: x,
    y: y,
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

