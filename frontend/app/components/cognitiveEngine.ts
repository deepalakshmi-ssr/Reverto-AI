import {
  CognitiveExecutionData,
  CognitiveNodeData,
  CognitiveEdgeData,
  CognitiveStatus,
} from "./cognitiveTypes";

export function createNode(
  title: string,
  description: string,
  parentId: string | null,
  action: string,
  status: CognitiveStatus = "pending",
  details?: {
    input?: string;
    output?: string;
    reasoning?: string;
  }
): CognitiveNodeData {
  return {
    id: `NODE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    description,
    parentId,
    action,
    timestamp: new Date().toISOString(),
    status,
    input: details?.input,
    output: details?.output,
    reasoning: details?.reasoning,
  };
}

export function createEdge(
  source: string,
  target: string,
  type: "normal" | "rollback" | "recovery" = "normal"
): CognitiveEdgeData {
  return {
    id: `EDGE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    source,
    target,
    type,
  };
}

export function appendExecutionNode(
  execution: CognitiveExecutionData,
  node: CognitiveNodeData,
  edgeType: "normal" | "rollback" | "recovery" = "normal"
): CognitiveExecutionData {
  const updatedNodes = [...execution.nodes, node];
  const updatedEdges = [...execution.edges];

  if (node.parentId) {
    updatedEdges.push(
      createEdge(node.parentId, node.id, edgeType)
    );
  }

  return {
    nodes: updatedNodes,
    edges: updatedEdges,
  };
}

export function updateNodeStatus(
  execution: CognitiveExecutionData,
  nodeId: string,
  status: CognitiveStatus
): CognitiveExecutionData {
  return {
    ...execution,
    nodes: execution.nodes.map((node) =>
      node.id === nodeId ? { ...node, status } : node
    ),
  };
}

export function findNode(
  execution: CognitiveExecutionData,
  nodeId: string
): CognitiveNodeData | undefined {
  return execution.nodes.find((node) => node.id === nodeId);
}