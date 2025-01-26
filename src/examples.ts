import type {Edge, Node} from "@xyflow/react";
import { NodeType, ProcessNodeType, StepNodeType, StoreNodeType, ConnectionType } from "./datamodel";


// define example nodes
const nodeA: ProcessNodeType = {
  _type: 'process',
  address: 'local:dfba',
  inputs: {
    'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store'],
    'fluxes': ['fluxes_store'],
    'parameters': ['parameters_store']
  },
  outputs: {
    'species_concentrations': ['species_concentrations_store'],
    'time': ['time_store'],
    'fluxes': ['fluxes_store'],
    'parameters': ['parameters_store']
  },
  config: {
    'model': {
      'model_file': 'sbml_model.xml'
    }
  },
  nodeId: 'dFBA'
}

const speciesStore: StoreNodeType = {
  value: 'species_concentrations_store',
  connections: [{
    nodeId: nodeA.nodeId,
    direction: 'in'
  }]
}

const nodeB: ProcessNodeType = {
  _type: 'process',
  address: 'local:membrane-process',
  inputs: {
    'geometry': ['geometry_store'],
    'fluxes': ['fluxes_store'],
    'protein_density': ['protein_density_store']
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
    'molecule_coordinates': ['molecule_coordinates_store'],
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

export const initialNodes = [
  { id: "dFBA", type: "process-node", position: { x: 0, y: 100}, data: nodeA },
  { id: "membrane", type: "process-node", position: { x: 300, y: -100 }, data: nodeB },
  { id: "particle", type: "process-node", position: { x: -300, y: 200 }, data: nodeC },
  { id: "species-store", type: "store-node", position: { x: -300, y: -22 }, data: speciesStore },
] satisfies Node[];

export const initialEdges = [
  { id: "dFBA->membrane", source: "dFBA", target: "membrane", animated: true, type: 'button-edge' },
  { id: "FBA->particle", source: "FBA", target: "particle", animated: true, type: 'button-edge' },
  { id: "particle->ODE", source: "particle", target: "ODE", animated: true, type: "button-edge" },
  { id: "species-store-dFBA>", source: "species-store", target: "dFBA", animated: true, type: 'button-edge' },
] satisfies Edge[];
