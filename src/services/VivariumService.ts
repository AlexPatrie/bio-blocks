import {
  BigraphNodeData,
  StoreNodeData,
  FormattedBigraphNode,
  FormattedStoreNode,
  FlowNodeConfig,
  FlowEdgeConfig,
  FlowNodePosition, FormattedComposition
} from "../datamodel";
import {randomInRange, randomPosition} from "../connect";

// Edge.ts

interface Core {
    generate(schema: object, config: object): [any, object];
}

export type PortDirection = "inputs" | "outputs";


export class VivariumService {
  public composite: FormattedComposition = {};
  public nodeData: BigraphNodeData[] = [];
  public objectData: StoreNodeData[] = [];
  
  public flowNodes: FlowNodeConfig[] = [];
  public flowEdges: FlowEdgeConfig[] = [];
  public minX?: number | undefined;
  public minY?: number | undefined;
  public maxX?: number | undefined;
  public maxY?: number | undefined;
  
  public document?: object | null;
  public processes?: object | null;
  public types?: object | null;
  public core?: Core | null;
  public require?: string[] | null;
  public emitterConfig?: object | null;
  
  public constructor(
    document: object | null = null,
    processes: object | null = null,
    types: object | null = null,
    core: Core | null = null,
    require: string[] | null = null,
    emitterConfig: object | null = null,
  ) {
    this.document = document;
    this.processes = processes;
    this.types = types;
    this.core = core;
    this.require = require;
    this.emitterConfig = emitterConfig;
  };
  
  // methods for generating generic type implementations
  public newPosition(): FlowNodePosition {
    return { x: Math.random() * 400, y: Math.random() * 400 }
  }
  
  public newBigraphNodeData(nodeId: string, nodeType: "process" | "step" | string, addressId: string): BigraphNodeData {
    return {
      nodeId: nodeId,
      _type: nodeType,
      address: addressId,
      config: {},
      inputs: {},
      outputs: {}
    };
  }
  
  public newStoreNodeData(nodeId: string, value: string[], connections?: string[] | undefined): StoreNodeData {
    return {
      nodeId: nodeId,
      value: value,
      connections: connections ? connections : []
    }
  }
  
  // factories for empty nodes(button-generated)
  public newEmptyBigraphNodeData(name?: string | null, address?: string | null, nodeIndex?: number | null, nodeType?: "process" | "step" | undefined | string): BigraphNodeData {
    const newId: string = `new-process-${!nodeIndex ? crypto.randomUUID() : nodeIndex}`;
    const nodeId = !name ? newId : name as string;
    const addressId = !address ? `local:${newId}` : address as string;
    return this.newBigraphNodeData(nodeId, nodeType ? nodeType : "process", addressId);
  }
  
  public newEmptyStoreNodeData(name?: string | undefined, nodeIndex?: number | undefined): StoreNodeData {
    const newId: string = `new-process-${!nodeIndex ? crypto.randomUUID() : nodeIndex}`;
    const nodeId = !name ? newId : name as string;
    const value = [`${nodeId}`];
    return this.newStoreNodeData(nodeId, value);
  }
  
  public getFlowNodeConfig(nodeId: string): FlowNodeConfig | undefined {
    return this.flowNodes.find(node => node.data.nodeId === nodeId);
  }
  
  public getFlowEdgeConfig(edgeId: string): FlowEdgeConfig | undefined {
    return this.flowEdges.find(edge => edge.id === edgeId);
  }

  public addProcess(node: BigraphNodeData): void {
    /* Takes in bigraph node data (FormattedBigraphNode + nodeId) and does the following:
      1. adds it to this.nodeData
      2. creates a corresponding react-flow node config for this node
    */
    console.log(`Adding process ${node.nodeId}`);
    this.nodeData.push(node);
    console.log(`Nodes: ${JSON.stringify(this.nodeData)}`);
    
    const position = this.newPosition();
    this.addFlowNodeConfig(node, position.x, position.y, "bigraph-node");
  };
  
  public removeProcess(nodeId: string): void {
    this.nodeData.forEach(node => {
      const index = this.nodeData.indexOf(node);
      this.nodeData.splice(index, 1)
    });
  };
  
  public addPort(nodeId: string, direction: PortDirection, value: string): void {
    this.nodeData.forEach((node: BigraphNodeData) => {
      if (nodeId === node.nodeId) {
        const inputValue = [`${value}_store`];
        // add input to node
        node[direction as string][value] = inputValue;
        
        // make new corresponding store
        const store: StoreNodeData = {
          value: inputValue,
          connections: [node.nodeId],
          nodeId: value
        }
        this.objectData.push(store);
        
        // add new flow node config corresponding to new store
        const position = this.newPosition();
        this.addFlowNodeConfig(store, position.x, position.y, "store-node");
        
        // make corresponding flow edge config for new store
        this.addFlowEdgeConfig(node.nodeId, store.nodeId);
      }
    });
  };
  
  public addInput(nodeId: string, value: string): void {
    return this.addPort(nodeId, "inputs", value);
  };
  
  public addOutput(nodeId: string, value: string): void {
    return this.addPort(nodeId, "outputs", value);
  };
  
  public addObject(store: StoreNodeData): void {
    this.objectData.push(store);

    const position = this.newPosition();
    this.addFlowNodeConfig(store, position.x, position.y, "store-node");
  }
  
  public removeObject(nodeId: string): void {
    this.objectData.forEach(node => {
      const index = this.objectData.indexOf(node);
      this.objectData.splice(index, 1)
    });
  };
  
  public compile(): void {
    console.log(`Node data length: ${this.nodeData.length}`)
    this.nodeData.forEach(node => {
      this.composite[node.nodeId] = {
        _type: node._type,
        address: node.address,
        config: node.config,
        inputs: node.inputs,
        outputs: node.outputs
      };
    });
    console.log(`The composite: ${JSON.stringify(this.composite)}`);
  };
  
  public flush(): void {
    this.nodeData = [];
    this.objectData = [];
    this.composite = {};
  }
  
  public addFlowNodeConfig(node: BigraphNodeData | StoreNodeData, x: number, y: number, nodeType: "bigraph-node" | "store-node", callback?: any): void {
    const flowNode: FlowNodeConfig = {
      id: node.nodeId,
      type: nodeType,
      position: {
        x: x,
        y: y
      },
      data: node
    };
    this.flowNodes.push(flowNode);
    console.log(`Pushed new flow node of type ${node}`);
  }
  
  public addFlowEdgeConfig(sourceId: string, targetId: string): void {
    const flowNode: FlowEdgeConfig = {
      id: `${sourceId}->${targetId}`,
      type: "button-edge",
      source: sourceId,
      target: targetId,
      animated: true
    };
    this.flowEdges.push(flowNode);
  }
  
}
