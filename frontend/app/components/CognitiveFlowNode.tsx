"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

type FlowNodeData = {
  title: string;
  description: string;
  status: string;
  action: string;
  nodeId: string;
};

const statusConfig: Record<
  string,
  { color: string; background: string; label: string }
> = {
  committed: {
    color: "#60a5fa",
    background: "#172554",
    label: "COMMITTED",
  },
  failed: {
    color: "#f87171",
    background: "#450a0a",
    label: "FAILED",
  },
  pruned: {
    color: "#fbbf24",
    background: "#451a03",
    label: "PRUNED",
  },
  recovered: {
    color: "#4ade80",
    background: "#052e16",
    label: "RECOVERED",
  },
  pending: {
    color: "#94a3b8",
    background: "#1e293b",
    label: "PENDING",
  },
};

function CognitiveFlowNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const config = statusConfig[nodeData.status] || statusConfig.pending;

  return (
    <div
      className={`cognitive-flow-node ${selected ? "flow-node-selected" : ""}`}
      style={{
        borderColor: config.color,
        boxShadow: selected
          ? `0 0 0 2px ${config.color}40, 0 12px 35px rgba(0,0,0,0.35)`
          : "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flow-node-top">
        <span className="flow-node-id">{nodeData.nodeId}</span>

        <span
          className="flow-node-status"
          style={{
            color: config.color,
            background: config.background,
          }}
        >
          {config.label}
        </span>
      </div>

      <h4>{nodeData.title}</h4>

      <p>{nodeData.description}</p>

      <div className="flow-node-action">
        <span>ACTION</span>
        <strong>{nodeData.action}</strong>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(CognitiveFlowNode);
