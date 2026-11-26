"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CognitiveFlowNode from "./CognitiveFlowNode";
import { CognitiveExecutionData } from "./cognitiveTypes";

type Props = {
  execution: CognitiveExecutionData;
  selectedNodeId: string | null;
  showPruned: boolean;
  onSelectNode: (nodeId: string) => void;
};

const nodeTypes = {
  cognitive: CognitiveFlowNode,
};

export default function CognitiveFlowCanvas({
  execution,
  selectedNodeId,
  showPruned,
  onSelectNode,
}: Props) {
  const visibleExecutionNodes = execution.nodes.filter(
    (node) => showPruned || node.status !== "pruned"
  );

  const visibleIds = new Set(
    visibleExecutionNodes.map((node) => node.id)
  );

  const nodes: Node[] = useMemo(() => {
    const horizontalSpacing = 370;
    const verticalSpacing = 220;

    return visibleExecutionNodes.map((node, index) => {
      let position = { x: 0, y: 0 };

      switch (node.id) {
        case "ROOT":
          position = { x: 450, y: 0 };
          break;
        case "N01":
          position = { x: 450, y: verticalSpacing };
          break;
        case "N02":
          position = { x: 450, y: verticalSpacing * 2 };
          break;
        case "N03":
          position = { x: 100, y: verticalSpacing * 3 };
          break;
        case "N04":
          position = { x: 100, y: verticalSpacing * 4 };
          break;
        case "N05":
          position = { x: 800, y: verticalSpacing * 3 };
          break;
        case "N06":
          position = { x: 800, y: verticalSpacing * 4 };
          break;
        case "N07":
          position = { x: 800, y: verticalSpacing * 5 };
          break;
        default:
          position = {
            x: 450 + (index % 3) * horizontalSpacing,
            y: verticalSpacing * 6 + Math.floor(index / 3) * 180,
          };
      }

      return {
        id: node.id,
        type: "cognitive",
        position,
        data: {
          title: node.title,
          description: node.description,
          status: node.status,
          action: node.action,
          nodeId: node.id,
        },
        selected: node.id === selectedNodeId,
      };
    });
  }, [visibleExecutionNodes, selectedNodeId]);

  const edges: Edge[] = useMemo(() => {
    return execution.edges
      .filter(
        (edge) =>
          visibleIds.has(edge.source) && visibleIds.has(edge.target)
      )
      .map((edge) => {
        let stroke = "#64748b";

        if (edge.type === "rollback") {
          stroke = "#f59e0b";
        }

        if (edge.type === "recovery") {
          stroke = "#22c55e";
        }

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          animated: edge.type === "recovery",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: stroke,
          },
          style: {
            stroke,
            strokeWidth: 2.5,
          },
        };
      });
  }, [execution.edges, visibleIds]);

  return (
    <div className="cognitive-flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#263449" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const status = node.data?.status;

            if (status === "failed") return "#ef4444";
            if (status === "pruned") return "#f59e0b";
            if (status === "recovered") return "#22c55e";
            if (status === "committed") return "#3b82f6";

            return "#64748b";
          }}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}