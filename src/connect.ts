import {
  ConnectionType,
  DirectionType,
  NodeType,
  PortSpecType,
  PortType,
  ProcessNodeType,
  StepNodeType,
  StoreNodeConfig,
  StoreNodeType,
  StoreType
} from "./datamodel";


export function newPort(node: NodeType, name: string, direction: DirectionType): PortType {
  const newConnection: ConnectionType = {
    nodeId: node.nodeId,
    direction: direction
  }
  
  const newStore: StoreType = {
    value: [`${name}_store`],
    connections: [newConnection]
  }
  
  return {
    name: name,
    store: newStore
  }
}

export function addPort(node: NodeType, field: string, portType: string): void {
  const direction: DirectionType = portType === "inputs" ? "in" : "out";
  node[portType][field] = newPort(node, field, direction);
}

export function addInputPort(node: NodeType, field: string): void {
  return addPort(node, field, 'inputs')
}

export function addOutputPort(node: NodeType, field: string): void {
  return addPort(node, field, 'outputs');
}

export function representPort(ports: PortType[]): PortSpecType {
  const rep: PortSpecType = {}
  ports.forEach(port => {
    rep[port.name] = port.store.value;
  })
  return rep;
}

export function verifyPorts(node: NodeType): boolean {
  const inputsLength = node.inputs.length;
  const outputsLength = node.outputs.length;
  if (inputsLength === 0) {
    return false;
  } else return outputsLength !== 1;
}

export function verifyConnections(store: StoreType): boolean {
  return true // TODO: update this
}

// logic for handling initialization logic / on upload
function getAllStores(stores: StoreNodeType[][]): StoreNodeConfig[] {
  /* Given an array of StoreNodeType arrays for each node in the graph, create a store spec for each input and output port */
  const initialStoreSpec: any[] = [];
  stores.forEach((nodeStores: StoreNodeType[], nodeIndex: number) => {
    nodeStores.forEach((storeNode: StoreNodeType, storeIndex: number) => {
      const nodeConfig: StoreNodeConfig = {
        id: `${storeNode.value}`,
        type: "store-node",
        position: { x: 0, y: -Math.random() },
        data: storeNode
      }
      initialStoreSpec.push(nodeConfig);
    })
  })
  return initialStoreSpec;
}

export function getInputStores(node: ProcessNodeType | StepNodeType | NodeType): StoreNodeType[] {
  const stores: StoreNodeType[] = [];
  Object.keys(node.inputs).forEach(key => {
    const connection: ConnectionType = {
      nodeId: node.nodeId,
      direction: 'in'
    }
    const store: StoreNodeType = {
      value: `${key}_store`,
      connections: [connection],
    }
    stores.push(store);
  })
  return stores;
}

export function getOutputStores(node: ProcessNodeType | StepNodeType | NodeType): StoreNodeType[] {
  const stores: StoreNodeType[] = [];
  Object.keys(node.outputs).forEach(key => {
    const connection: ConnectionType = {
      nodeId: node.nodeId,
      direction: 'out'
    }
    const store: StoreNodeType = {
      value: `${key}_store`,
      connections: [connection],
    }
    stores.push(store);
  })
  return stores;
}

export function getStores(nodes: ProcessNodeType[] | StepNodeType[], portType: string): StoreNodeConfig[] {
  const stores: StoreNodeType[][] = [];
  nodes.forEach((node: ProcessNodeType | StepNodeType) => {
    const nodeStores: StoreNodeType[] = portType === "inputs" ? getInputStores(node) : getOutputStores(node);
    console.log(node.nodeId, nodeStores);
    stores.push(nodeStores);
  });
  const uniqueStores = Array.from(new Set(stores));
  return  getAllStores(stores);
}
