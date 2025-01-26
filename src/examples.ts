import type {Edge, Node} from "@xyflow/react";
import {NodeType, ProcessNodeType, StepNodeType, StoreNodeType, ConnectionType, StoreNodeConfig} from "./datamodel";
import {getStores} from "./connect";


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
  nodeId: 'dFBA'
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
    'velocities': ['velocities_store'],
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
  nodeId: 'membrane'
}

const nodeC: ProcessNodeType = {
  _type: 'process',
  address: 'local:smoldyn-process',
  inputs: {
    // 'molecule_coordinates': ['molecule_coordinates_store'],
    'forces': ['forces_store'],
  },
  outputs: {
    'particles': ['particles_store'],
  },
  config: {
    'model': {
      'model_file': 'smoldyn_model.txt'
    }
  },
  nodeId: 'particle'
}

const timeStore: StoreNodeType = {
  value: "time_store",
  connections: [
    {
      nodeId: 'dFBA',
      direction: 'in'
    }
  ]
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
  ]
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
  ]
}

const particlesStore: StoreNodeType = {
  value: 'particles_store',
  connections: [
    {
      nodeId: 'particle',
      direction: 'out'
    }
  ]
}

const exampleNodes: ProcessNodeType[] = [nodeA];

// export const initialInputStores: StoreNodeConfig[] = getStores(exampleNodes, 'inputs') satisfies Node[];
//export const initialOutputStores: StoreNodeConfig[] = getStores(exampleNodes, 'outputs') satisfies Node[];
// export const initialOutputStores: StoreNodeConfig[] = [];

export const initialNodes = [
  { id: "dFBA", type: "process-node", position: { x: 0, y: 100}, data: nodeA },
  { id: "time-store", type: "store-node", position: { x: -100, y: 100 }, data: timeStore },
  { id: "parameters-store", type: "store-node", position: { x: 100, y: 0 }, data: parametersStore },
  { id: "species-concentrations-store", type: "store-node", position: { x: 250, y: 350 }, data: speciesConcentrationsStore },
  { id: "fluxes-store", type: "store-node", position: { x: 200, y: 100 }, data: fluxesStore },
  { id: "geometry-store", type: "store-node", position: { x: 200, y: 100 }, data: geometryStore },
  { id: "velocities-store", type: "store-node", position: { x: 200, y: 100 }, data: velocitiesStore },
  { id: "forces-store", type: "store-node", position: { x: 200, y: 100 }, data: forcesStore },
  { id: "particles-store", type: "store-node", position: { x: 200, y: 100 }, data: particlesStore },
  //{ id: "membrane", type: "process-node", position: { x: 300, y: -100 }, data: nodeB },
  //{ id: "particle", type: "process-node", position: { x: -300, y: 200 }, data: nodeC },
  // { id: "species-store", type: "store-node", position: { x: -300, y: -22 }, data: speciesStore },
] satisfies Node[];

// export const initialEdges = [
//   { id: "dFBA->speciesConcentrations", source: "dFBA", target: "species_concentrations_store", animated: true, type: 'data-edge' },
//   // { id: "dFBA->membrane", source: "dFBA", target: "membrane", animated: true, type: 'button-edge' },
//   //{ id: "membrane->particle", source: "membrane", target: "particle", animated: true, type: 'button-edge' },
//   //{ id: "particle->dFBA", source: "particle", target: "dFBA", animated: true, type: "button-edge" },
// ] satisfies Edge[];

export const initialEdges = [
  // {
  //   id: 'dFBA->species-concentrations',
  //   type: 'button-edge',
  //   source: 'dFBA',
  //   target: 'species-concentrations-store',
  //   animated: true
  //   // data: { key: 'species_concentrations_store' },
  //   // targetHandle: 'species_concentrations_store',
  // },
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
  }
]
