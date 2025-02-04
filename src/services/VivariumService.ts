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
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

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
  
  public newPosition(): FlowNodePosition {
    return randomPosition(this.minX, this.maxX, this.minY, this.maxY);
  }
  
  public newEmptyBigraphNodeData(name?: string | null, address?: string | null): BigraphNodeData {
    const newId: string = `new-process-${randomInRange(0, 20)}`;
    return {
        nodeId: !name ? newId : name as string,
        _type: "process",
        address: !address ? `local:${newId}` : address as string,
        config: {},
        inputs: {},
        outputs: {}
      };
  }
  
  public getFlowNodeConfig(nodeId: string): FlowNodeConfig | undefined {
    return this.flowNodes.find(node => node.data.nodeId === nodeId);
  }
  
  public getFlowEdgeConfig(edgeId: string): FlowEdgeConfig | undefined {
    return this.flowEdges.find(edge => edge.id === edgeId);
  }

  public addProcess(node: BigraphNodeData): void {
    /* Takes in either an uploaded bigraph node (that is from a spec.json file in FormattedBigraphNode format),
      or a name and address
     */
    // make process and add to nodes state
    const newNode: BigraphNodeData = node;
    this.nodeData.push(newNode);
    
    // make corresponding react flow node config for new node
    const position = this.newPosition();
    this.addFlowNodeConfig(newNode, position.x, position.y);
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
        this.addFlowNodeConfig(store, position.x, position.y);
        
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
  }
  
  public removeObject(nodeId: string): void {
    this.objectData.forEach(node => {
      const index = this.objectData.indexOf(node);
      this.objectData.splice(index, 1)
    });
  };
  
  public compile(): void {
    this.nodeData.forEach(node => {
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
    this.nodeData = [];
    this.objectData = [];
    this.composite = {};
  }
  
  public addFlowNodeConfig(node: BigraphNodeData | StoreNodeData, x: number, y: number): void {
    const flowNode: FlowNodeConfig = {
      id: node.nodeId,
      type: node as BigraphNodeData ? "bigraph-node" : "store-node",
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
