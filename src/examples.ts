import type { Node } from "@xyflow/react";
import { NodeType } from "./datamodel";


// define example nodes
const nodeA: NodeType = {
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

const nodeB: NodeType = {
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

const nodeC: NodeType = {
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
  { id: "ODE", type: "bigraph-node", position: { x: 0, y: 0}, data: nodeA },
  { id: "FBA", type: "bigraph-node", position: { x: 300, y: 0 }, data: nodeB },
  { id: "particle", type: "bigraph-node", position: { x: -300, y: 0 }, data: nodeC },
] satisfies Node[];
