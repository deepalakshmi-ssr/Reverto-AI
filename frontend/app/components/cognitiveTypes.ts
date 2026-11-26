export type CognitiveStatus =
  | "committed"
  | "failed"
  | "pruned"
  | "recovered"
  | "pending";

export type CognitiveNodeData = {
  id: string;
  title: string;
  description: string;
  parentId: string | null;
  action: string;
  timestamp: string;
  status: CognitiveStatus;
  input?: string;
  output?: string;
  reasoning?: string;
};

export type CognitiveEdgeData = {
  id: string;
  source: string;
  target: string;
  type: "normal" | "rollback" | "recovery";
};

export type CognitiveExecutionData = {
  nodes: CognitiveNodeData[];
  edges: CognitiveEdgeData[];
};