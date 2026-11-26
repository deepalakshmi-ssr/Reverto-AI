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

import CognitiveFlowNode from "./CognitiveFlowNode";
import { CognitiveExecutionData } from "./cognitiveTypes";
import { layoutCognitiveGraph } from "./cognitiveLayout";
import "@xyflow/react/dist/style.css";

type Props = {
  execution: CognitiveExecutionData;
  selectedNodeId: string | null;
  showPruned: boolean;
  onSelectNode: (nodeId: string) => void;
};

const nodeTypes = { cognitive: CognitiveFlowNode };

export default function CognitiveFlowCanvas({
  execution,
  selectedNodeId,
  showPruned,
  onSelectNode,
}: Props) {
  const graph = useMemo(() => {
    const visibleExecutionNodes = execution.nodes.filter(
      (node) => showPruned || node.status !== "pruned"
    );

    const visibleIds = new Set(
      visibleExecutionNodes.map((node) => node.id)
    );

    const rawNodes: Node[] = visibleExecutionNodes.map((node) => ({
      id: node.id,
      type: "cognitive",
      position: { x: 0, y: 0 },
      data: {
        title: node.title,
        description: node.description,
        status: node.status,
        action: node.action,
        nodeId: node.id,
      },
      selected: node.id === selectedNodeId,
    }));

    const rawEdges: Edge[] = execution.edges
      .filter(
        (edge) =>
          visibleIds.has(edge.source) &&
          visibleIds.has(edge.target)
      )
      .map((edge) => {
        let stroke = "#64748b";

        if (edge.type === "rollback") stroke = "#f59e0b";
        if (edge.type === "recovery") stroke = "#22c55e";

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

    return layoutCognitiveGraph(rawNodes, rawEdges, "TB");
  }, [execution, selectedNodeId, showPruned]);

  return (
    <div className="cognitive-flow-canvas">
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
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