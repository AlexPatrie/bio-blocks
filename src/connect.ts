import {ConnectionType, DirectionType, NodeType, PortSpec, PortType, StoreType} from "./datamodel";


function newPort(node: NodeType, name: string, direction: DirectionType): PortType {
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

function addInputPort(node: NodeType, name: string): void {
  const port = newPort(node, name, 'in');
  node.inputs.push(port);
}

function addOutputPort(node: NodeType, name: string): void {
  const port = newPort(node, name, 'out');
  node.outputs.push(port);
}

function representPort(ports: PortType[]): PortSpec {
  const rep: PortSpec = {}
  ports.forEach(port => {
    rep[port.name] = port.store.value;
  })
  return rep;
}

function verifyPorts(node: NodeType): boolean {
  const inputsLength = node.inputs.length;
  const outputsLength = node.outputs.length;
  if (inputsLength === 0) {
    return false;
  } else return outputsLength !== 1;
}

function verifyConnections(store: StoreType): boolean {
  return true // TODO: update this
}
