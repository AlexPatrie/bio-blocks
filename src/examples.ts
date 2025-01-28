import type {Edge, Node} from "@xyflow/react";
import {BigraphNode, FormattedBigraphNode, FormattedComposition} from "./datamodel";
import {CustomNodeType} from "./components/nodes";
import {randomPosition} from "./connect";

export const exampleHybrid: FormattedComposition = {
    dFBA: {
        _type: 'process',
        address: 'local:dfba',
        config: {
            model: {
                model_file: 'sbml_model.xml'
            }
        },
        inputs: {
            time: ['time_store'],
            parameters: ['parameters_store']
        },
        outputs: {
            species_concentrations: ['species_concentrations_store'],
            fluxes: ['fluxes_store'],
        },
    },
    membrane: {
        _type: 'process',
        address: 'local:membrane-process',
        config: {
            geometry: {
                _type: 'icosphere',
                parameters: {
                    'radius': 0.1,
                    'subdivision': 3
                }
            }
        },
        inputs: {
            fluxes: ['fluxes_store'],
        },
        outputs: {
            geometry: ['geometry_store'],
            forces: ['forces_store'],
        },
    },
    particle: {
        _type: 'process',
        address: 'local:smoldyn-process',
        config: {
            model: {
                model_file: 'smoldyn_model.txt'
            }
        },
        inputs: {
            forces: ['forces_store'],
        },
        outputs: {
            molecules: ['molecules_store'],
        },
    }
}

function getCompositionNodes(composition: FormattedComposition) {
  const nodes: Node[] = [];
  Object.keys(composition).forEach((nodeId: string) => {
    const uploadedNode: FormattedBigraphNode = composition[nodeId];
    const node: CustomNodeType = {
      id: nodeId,
      type: "bigraph-node",
      position: randomPosition(),
      data: {
      
      }
    }
    
  })
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
    type: 'data-edge',
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
