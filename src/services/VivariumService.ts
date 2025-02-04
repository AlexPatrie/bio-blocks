import {
  BigraphNodeData,
  StoreNodeData,
  FormattedBigraphNode,
  FormattedStoreNode,
  FlowNodeConfig,
  FlowEdgeConfig,
  FlowNodePosition, FormattedComposition
} from "../datamodel";
import { randomPosition } from "../connect";

// Edge.ts

interface Core {
    generate(schema: object, config: object): [any, object];
}

export type PortDirection = "inputs" | "outputs";


export class VivariumService {
  public composite: FormattedComposition = {};
  public nodes: BigraphNodeData[] = [];
  public objects: StoreNodeData[] = [];
  
  public flowNodes: FlowNodeConfig[] = [];
  public flowEdges: FlowEdgeConfig[] = [];
  public minX?: number | undefined;
  public minY?: number | undefined;
  public maxX?: number | undefined;
  public maxY?: number | undefined;
  
  public document: object | null = null;
  public processes: object | null = null;
  public types: object | null = null;
  public core: Core | null = null;
  public require: string[] | null = null;
  public emitterConfig: object | null = null;
  
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
  
  public getFlowNodeConfig(nodeId: string): FlowNodeConfig | undefined {
    return this.flowNodes.find(node => node.data.nodeId === nodeId);
  }
  
  public getFlowEdgeConfig(edgeId: string): FlowEdgeConfig | undefined {
    return this.flowEdges.find(edge => edge.id === edgeId);
  }

  public addProcess(name: string, address: string): void {
    // make process and add to nodes state
    const newNode: BigraphNodeData = {
      nodeId: name,
      _type: "process",
      address: address,
      config: {},
      inputs: {},
      outputs: {}
    };
    this.nodes.push(newNode);
    
    // make corresponding react flow node config for new node
    const position = randomPosition(this.minX, this.maxX, this.minY, this.maxY);
    this.addFlowNodeConfig(newNode, position.x, position.y);
  };
  
  public removeProcess(nodeId: string): void {
    this.nodes.forEach(node => {
      const index = this.nodes.indexOf(node);
      this.nodes.splice(index, 1)
    });
  };
  
  public addPort(nodeId: string, direction: PortDirection, value: string): void {
    this.nodes.forEach((node: BigraphNodeData) => {
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
        this.objects.push(store);
        
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
  
  public addObject(value: string): void {
    const store: StoreNodeData = {
      value: [value],
      nodeId: value,
      connections: []
    };
    this.objects.push(store);
  };
  
  public removeObject(nodeId: string): void {
    this.objects.forEach(node => {
      const index = this.objects.indexOf(node);
      this.objects.splice(index, 1)
    });
  };
  
  public compile(): void {
    this.nodes.forEach(node => {
      this.composite[node.nodeId] = {
        _type: node._type,
        address: node.address,
        config: node.config,
        inputs: node.inputs,
        outputs: node.outputs
      };
    });
  };
  
  public flush(): void {
    this.nodes = [];
    this.objects = [];
    this.composite = {};
  }
  
  public addFlowNodeConfig(node: BigraphNodeData, x: number, y: number): void {
    const flowNode: FlowNodeConfig = {
      id: node.nodeId,
      type: "bigraph-node",
      position: {
        x: x,
        y: y
      },
      data: node
    };
    this.flowNodes.push(flowNode);
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
