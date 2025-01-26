import type {Edge, Node} from "@xyflow/react";
import {NodeType, ProcessNodeType, StepNodeType, StoreNodeType, ConnectionType, StoreNodeConfig} from "./datamodel";
import {getStores} from "./connect";
import {Position} from "@xyflow/react";


// define example nodes
const nodeA: ProcessNodeType = {
  _type: 'process',
  address: 'local:dfba',
  inputs: {
    // 'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store'],
    // 'fluxes': ['fluxes_store'],
    'parameters': ['parameters_store']
  },
  outputs: {
    'species_concentrations': ['species_concentrations_store'],
    // 'time': ['time_store'],
    'fluxes': ['fluxes_store'],
    // 'parameters': ['parameters_store']
  },
  config: {
    'model': {
      'model_file': 'sbml_model.xml'
    }
  },
  nodeId: 'dFBA',
}

const nodeB: ProcessNodeType = {
  _type: 'process',
  address: 'local:membrane-process',
  inputs: {
    // 'geometry': ['geometry_store'],
    'fluxes': ['fluxes_store'],
    // 'protein_density': ['protein_density_store']
  },
  outputs: {
    'geometry': ['geometry_store'],
    // 'velocities': ['velocities_store'],
    'forces': ['forces_store'],
  },
  config: {
    'geometry': {
      'type': 'icosphere',
      'parameters': {
        'radius': 0.1,
        'subdivision': 3
      }
    }
  },
  nodeId: 'membrane',
  inputPosition: Position.Top,
  outputPosition: Position.Right
}

const nodeC: ProcessNodeType = {
  _type: 'process',
  address: 'local:smoldyn-process',
  inputs: {
    // 'molecule_coordinates': ['molecule_coordinates_store'],
    'forces': ['forces_store'],
  },
  outputs: {
    'molecules': ['molecules_store'],
  },
  config: {
    'model': {
      'model_file': 'smoldyn_model.txt'
    }
  },
  nodeId: 'particle',
  inputPosition: Position.Top,
  outputPosition: Position.Right
  
}

const timeStore: StoreNodeType = {
  value: "time_store",
  connections: [
    {
      nodeId: 'dFBA',
      direction: 'in'
    }
  ],
}

const parametersStore: StoreNodeType = {
  value: "parameters_store",
  connections: [
    {
      nodeId: 'dFBA',
      direction: 'in'
    }
  ]
}

const speciesConcentrationsStore: StoreNodeType = {
  value: 'species_concentrations_store',
  connections: [
    {
      nodeId: 'dFBA',
      direction: 'out'
    }
  ]
}

const fluxesStore: StoreNodeType = {
  value: 'fluxes_store',
  connections: [
     {
      nodeId: 'dFBA',
      direction: 'out'
    },
    {
      nodeId: 'membrane',
      direction: 'in'
    }
  ],
  outputPosition: Position.Bottom
}

const geometryStore: StoreNodeType = {
  value: 'geometry_store',
  connections: [
    {
      nodeId: 'membrane',
      direction: 'out'
    }
  ]
}

const velocitiesStore: StoreNodeType = {
  value: 'velocities_store',
  connections: [
    {
      nodeId: 'membrane',
      direction: 'out'
    }
  ]
}

const forcesStore: StoreNodeType = {
  value: 'forces_store',
  connections: [
    {
      nodeId: 'membrane',
      direction: 'out'
    },
    {
      nodeId: 'particle',
      direction: 'in'
    }
  ],
  outputPosition: Position.Bottom
}

const moleculesStore: StoreNodeType = {
  value: 'molecules_store',
  connections: [
    {
      nodeId: 'particle',
      direction: 'out'
    }
  ]
}


// TODO: add a dynamic setter that positions all processes in the same x axis and stores in the same x axis (change y)
export const initialNodes = [
  { id: "dFBA", type: "process-node", position: { x: -600, y: -600}, data: nodeA },
  { id: "time-store", type: "store-node", position: { x: -1000, y: -600 }, data: timeStore },
  { id: "parameters-store", type: "store-node", position: { x: -1000, y: -400 }, data: parametersStore },
  { id: "species-concentrations-store", type: "store-node", position: { x: 200, y: -600 }, data: speciesConcentrationsStore },
  { id: "fluxes-store", type: "store-node", position: { x: 200, y: -400 }, data: fluxesStore },
  { id: "membrane", type: "process-node", position: { x: -600, y: -200 }, data: nodeB },
  { id: "geometry-store", type: "store-node", position: { x: 200, y: -200 }, data: geometryStore },
  // { id: "velocities-store", type: "store-node", position: { x: 200, y: -200}, data: velocitiesStore },
  { id: "forces-store", type: "store-node", position: { x: 200, y: 0 }, data: forcesStore },
  { id: "particle", type: "process-node", position: { x: -600, y: 200 }, data: nodeC },
  { id: "molecules-store", type: "store-node", position: { x: 200, y: 200 }, data: moleculesStore },
] satisfies Node[];

export const initialEdges = [
  {
    id: 'parameters->dFBA',
    type: 'button-edge',
    source: 'parameters-store',
    target: 'dFBA',
    animated: true
  },
  {
    id: 'time->dFBA',
    type: 'button-edge',
    source: 'time-store',
    target: 'dFBA',
    animated: true
  },
  {
    id: 'dFBA->fluxes',
    type: 'button-edge',
    source: 'dFBA',
    target: 'fluxes-store',
    animated: true
  },
  {
    id: 'dFBA->species-concentrations',
    type: 'button-edge',
    source: 'dFBA',
    target: 'species-concentrations-store',
    animated: true
  },
  {
    id: 'fluxes->membrane',
    type: 'button-edge',
    source: 'fluxes-store',
    target: 'membrane',
    animated: true
  },
  {
    id: 'membrane->geometry',
    type: 'button-edge',
    source: 'membrane',
    target: 'geometry-store',
    animated: true
  },
  {
    id: 'membrane->forces',
    type: 'button-edge',
    source: 'membrane',
    target: 'forces-store',
    animated: true
  },
  {
    id: 'forces->particle',
    type: 'button-edge',
    source: 'forces-store',
    target: 'particle',
    animated: true
  },
  {
    id: 'particle->molecules',
    type: 'button-edge',
    source: 'particle',
    target: 'molecules-store',
    animated: true
  },
]
