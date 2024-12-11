import type { BuiltInNode, Node, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";

import BigraphNode, {
  type BigraphNode as BigraphNodeType,
} from "./BigraphNode";

import { BigraphNodeData } from "./BigraphNode";

// define example nodes
const nodeA: BigraphNodeData = {
  label: 'ODE(copasi)',
  _type: 'process',
  address: 'local:copasi-process',
  inputs: {
    'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store'],
    'parameters': ['parameters_store']
  },
  outputs: {
    'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store']
  },
  config: {
    'model_file': '/some/path/to/a/file'
  }
}

const nodeB: BigraphNodeData = {
  label: 'FBA(cobra)',
  _type: 'process',
  address: 'local:cobra-process',
  inputs: {
    'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store'],
    'parameters': ['parameters_store']
  },
  outputs: {
    'fluxes': ['fluxes_store'],
  },
  config: {
    'model_file': '/some/path/to/a/file'
  }
}

const nodeC: BigraphNodeData = {
  label: 'StochasticParticle(Smoldyn)',
  _type: 'process',
  address: 'local:smoldyn-process',
  inputs: {
    'fluxes': ['fluxes_store'],
  },
  outputs: {
    'particles': ['particles_store'],
  },
  config: {
    'model_file': '/some/path/to/a/file'
  }
}

export const initialNodes = [
  { id: "a", type: "bigraph-node", position: { x: 200, y: -200 }, data: nodeA },
  { id: "b", type: "bigraph-node", position: { x: 200, y: 200 }, data: nodeB },
  { id: "c", type: "bigraph-node", position: { x: -200, y: 0 }, data: nodeC },
] satisfies Node[];


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "bigraph-node": BigraphNode
  // Add any of your custom nodes here!
} satisfies NodeTypes;

// Append the types of you custom edges to the BuiltInNode type
export type CustomNodeType = BuiltInNode | PositionLoggerNodeType | BigraphNodeType;
