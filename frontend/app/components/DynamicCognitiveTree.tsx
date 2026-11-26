"use client";

import { useState } from "react";
import { initialExecution } from "./cognitiveInitialData";
import {
  appendExecutionNode,
  createNode,
  updateNodeStatus,
} from "./cognitiveEngine";
import {
  CognitiveExecutionData,
  CognitiveNodeData,
} from "./cognitiveTypes";

export default function DynamicCognitiveTree() {
  const [execution, setExecution] =
    useState<CognitiveExecutionData>(initialExecution);

  const [selectedNode, setSelectedNode] =
    useState<CognitiveNodeData | null>(initialExecution.nodes[0]);

  const [showPruned, setShowPruned] = useState(true);

  const visibleNodes = execution.nodes.filter(
    (node) => showPruned || node.status !== "pruned"
  );

  const rootNode = visibleNodes.find(
    (node) => node.parentId === null
  );

  const getChildren = (nodeId: string) =>
    visibleNodes.filter((node) => node.parentId === nodeId);

  const statusColor = (status: string) => {
    switch (status) {
      case "committed":
        return "#3b82f6";
      case "failed":
        return "#ef4444";
      case "pruned":
        return "#f59e0b";
      case "recovered":
        return "#22c55e";
      default:
        return "#64748b";
    }
  };

  const renderNode = (node: CognitiveNodeData) => {
    const children = getChildren(node.id);

    return (
      <div key={node.id} className="dynamic-node-container">
        <div
          className={`dynamic-cognitive-node ${
            selectedNode?.id === node.id ? "selected" : ""
          }`}
          onClick={() => setSelectedNode(node)}
          style={{
            borderLeft: `4px solid ${statusColor(node.status)}`,
          }}
        >
          <div className="dynamic-node-header">
            <span className="dynamic-node-id">{node.id}</span>
            <span
              className="dynamic-node-status"
              style={{ color: statusColor(node.status) }}
            >
              {node.status.toUpperCase()}
            </span>
          </div>

          <h4>{node.title}</h4>

          <p>{node.description}</p>

          <div className="dynamic-node-action">
            {node.action}
          </div>
        </div>

        {children.length > 0 && (
          <>
            <div className="dynamic-node-connector" />

            <div
              className={`dynamic-children ${
                children.length > 1 ? "multiple" : ""
              }`}
            >
              {children.map((child) => renderNode(child))}
            </div>
          </>
        )}
      </div>
    );
  };

  const addExecutionStep = () => {
    const lastNode = execution.nodes[execution.nodes.length - 1];

    const newNode = createNode(
      "New Execution Step",
      "Dynamically generated execution node.",
      lastNode.id,
      "Dynamic execution",
      "pending",
      {
        input: "Previous execution context",
        output: "Awaiting execution",
        reasoning: "This node was generated dynamically.",
      }
    );

    const updatedExecution = appendExecutionNode(
      execution,
      newNode,
      "normal"
    );

    setExecution(updatedExecution);
    setSelectedNode(newNode);
  };

  const simulateFailure = () => {
    if (!selectedNode) return;

    const failedExecution = updateNodeStatus(
      execution,
      selectedNode.id,
      "failed"
    );

    const recoveryNode = createNode(
      "Recovery Attempt",
      "A new recovery branch generated after execution failure.",
      selectedNode.id,
      "Recover failed execution",
      "recovered",
      {
        input: selectedNode.output || "Failed execution context",
        output: "Recovery branch created",
        reasoning:
          "The execution engine creates an alternative branch after detecting failure.",
      }
    );

    const recoveredExecution = appendExecutionNode(
      failedExecution,
      recoveryNode,
      "recovery"
    );

    setExecution(recoveredExecution);
    setSelectedNode(recoveryNode);
  };

  const resetExecution = () => {
    setExecution(initialExecution);
    setSelectedNode(initialExecution.nodes[0]);
  };

  const committedCount = execution.nodes.filter(
    (node) => node.status === "committed"
  ).length;

  const failedCount = execution.nodes.filter(
    (node) => node.status === "failed"
  ).length;

  const recoveredCount = execution.nodes.filter(
    (node) => node.status === "recovered"
  ).length;

  const prunedCount = execution.nodes.filter(
    (node) => node.status === "pruned"
  ).length;

  return (
    <div className="dynamic-cognitive-workspace">
      <div className="dynamic-cognitive-toolbar">
        <div>
          <h2>Dynamic Cognitive Execution Tree</h2>
          <p>
            Data-driven execution graph with dynamic branching
            and state management.
          </p>
        </div>

        <div className="dynamic-cognitive-actions">
          <button onClick={addExecutionStep}>
            + Add Execution Node
          </button>

          <button onClick={simulateFailure}>
            Simulate Failure
          </button>

          <button onClick={resetExecution}>
            Reset
          </button>
        </div>
      </div>

      <div className="dynamic-cognitive-metrics">
        <div>
          <span>Total Nodes</span>
          <strong>{execution.nodes.length}</strong>
        </div>

        <div>
          <span>Committed</span>
          <strong>{committedCount}</strong>
        </div>

        <div>
          <span>Failed</span>
          <strong>{failedCount}</strong>
        </div>

        <div>
          <span>Recovered</span>
          <strong>{recoveredCount}</strong>
        </div>

        <div>
          <span>Pruned</span>
          <strong>{prunedCount}</strong>
        </div>
      </div>

      <div className="dynamic-cognitive-content">
        <div className="dynamic-cognitive-canvas">
          <div className="dynamic-cognitive-canvas-toolbar">
            <label>
              <input
                type="checkbox"
                checked={showPruned}
                onChange={(e) => setShowPruned(e.target.checked)}
              />
              Show pruned nodes
            </label>
          </div>

          <div className="dynamic-cognitive-graph">
            {rootNode && renderNode(rootNode)}
          </div>
        </div>

        <aside className="dynamic-cognitive-inspector">
          <h3>Execution Inspector</h3>

          {selectedNode ? (
            <>
              <div className="inspector-section">
                <span>Node ID</span>
                <strong>{selectedNode.id}</strong>
              </div>

              <div className="inspector-section">
                <span>Title</span>
                <strong>{selectedNode.title}</strong>
              </div>

              <div className="inspector-section">
                <span>Status</span>
                <strong
                  style={{
                    color: statusColor(selectedNode.status),
                  }}
                >
                  {selectedNode.status.toUpperCase()}
                </strong>
              </div>

              <div className="inspector-section">
                <span>Description</span>
                <p>{selectedNode.description}</p>
              </div>

              <div className="inspector-section">
                <span>Action</span>
                <p>{selectedNode.action}</p>
              </div>

              <div className="inspector-section">
                <span>Input</span>
                <p>{selectedNode.input || "No input recorded"}</p>
              </div>

              <div className="inspector-section">
                <span>Output</span>
                <p>{selectedNode.output || "No output recorded"}</p>
              </div>

              <div className="inspector-section">
                <span>Reasoning</span>
                <p>
                  {selectedNode.reasoning ||
                    "No reasoning recorded"}
                </p>
              </div>

              <div className="inspector-section">
                <span>Timestamp</span>
                <p>
                  {new Date(selectedNode.timestamp).toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <p>Select an execution node.</p>
          )}
        </aside>
      </div>
    </div>
  );
}