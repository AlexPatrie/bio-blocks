import {ConnectionType, DirectionType, NodeType, PortSpecType, PortType, StoreType} from "./datamodel";


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

export function addPort(node: NodeType, name: string, direction: string, portType: string): void {
  const port = newPort(node, name, 'out');
  node[portType][name] = port;
}

export function addInputPort(node: NodeType, name: string): void {
  const port: PortType = newPort(node, name, 'in');
  node.inputs[name] = port;
}

export function addOutputPort(node: NodeType, name: string): void {
  // const port = newPort(node, name, 'out');
  // node.inputs[name] = port;
  return addPort(node, name, 'out', 'output')
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
