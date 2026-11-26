"use client";

import { useMemo, useState } from "react";

type ContextSegment = {
  id: string;
  name: string;
  description: string;
  tokens: number;
  color: string;
  status: "retained" | "compressed" | "discarded";
  content: string[];
};

const initialSegments: ContextSegment[] = [
  {
    id: "system",
    name: "System Instructions",
    description: "Core operating instructions and agent constraints.",
    tokens: 4200,
    color: "#8b5cf6",
    status: "retained",
    content: [
      "Agent role and behavioral constraints",
      "Tool usage and execution policies",
      "Output formatting requirements",
    ],
  },
  {
    id: "memory",
    name: "Persistent Memory",
    description: "Relevant information carried across execution sessions.",
    tokens: 2800,
    color: "#06b6d4",
    status: "retained",
    content: [
      "Previously established user preferences",
      "Persistent task context",
      "Relevant long-term information",
    ],
  },
  {
    id: "conversation",
    name: "Conversation History",
    description: "Recent user and agent interaction history.",
    tokens: 12400,
    color: "#3b82f6",
    status: "retained",
    content: [
      "Recent user requests",
      "Agent responses",
      "Execution checkpoints",
    ],
  },
  {
    id: "tools",
    name: "Tool State",
    description: "Tool definitions, execution results, and tool state.",
    tokens: 5600,
    color: "#f59e0b",
    status: "retained",
    content: [
      "Tool descriptions",
      "Execution results",
      "Tool availability and constraints",
    ],
  },
  {
    id: "reasoning",
    name: "Task State",
    description: "Task progress, active objectives, and execution variables.",
    tokens: 3600,
    color: "#10b981",
    status: "retained",
    content: [
      "Current task objective",
      "Execution progress",
      "Active task variables",
    ],
  },
  {
    id: "noise",
    name: "Redundant Context",
    description: "Repeated, outdated, or low-relevance contextual material.",
    tokens: 7200,
    color: "#ef4444",
    status: "compressed",
    content: [
      "Repeated instructions",
      "Outdated task information",
      "Low-relevance historical messages",
    ],
  },
];

export default function ContextXRay() {
  const [segments, setSegments] = useState(initialSegments);
  const [selected, setSelected] = useState<string>("conversation");
  const [pruning, setPruning] = useState(false);

  const totalTokens = segments.reduce(
    (sum, segment) => sum + segment.tokens,
    0
  );

  const activeTokens = segments
    .filter((segment) => segment.status !== "discarded")
    .reduce((sum, segment) => sum + segment.tokens, 0);

  const capacity = 64000;

  const selectedSegment = segments.find(
    (segment) => segment.id === selected
  );

  const utilization = Math.min(
    (activeTokens / capacity) * 100,
    100
  );

  const formatTokens = (value: number) =>
    value.toLocaleString("en-US");

  const pruneContext = () => {
    setPruning(true);

    setTimeout(() => {
      setSegments((prev) =>
        prev.map((segment) =>
          segment.id === "noise"
            ? { ...segment, status: "discarded" }
            : segment
        )
      );

      setPruning(false);
    }, 700);
  };

  const resetContext = () => {
    setSegments(initialSegments);
  };

  const segmentPercentage = (tokens: number) =>
    (tokens / capacity) * 100;

  const activeSegments = useMemo(
    () => segments.filter((segment) => segment.status !== "discarded"),
    [segments]
  );

  return (
    <div className="cxray">
      <div className="cxray-header">
        <div>
          <div className="cxray-eyebrow">
            COGNITIVE ENGINE / CONTEXT ANALYSIS
          </div>

          <h1>Context X-Ray</h1>

          <p>
            Inspect, analyze, and surgically optimize the agent's
            working context.
          </p>
        </div>

        <div className="cxray-actions">
          <button
            className="cxray-btn secondary"
            onClick={resetContext}
          >
            ↺ Reset
          </button>

          <button
            className="cxray-btn primary"
            onClick={pruneContext}
            disabled={pruning}
          >
            {pruning ? "Optimizing..." : "✦ Optimize Context"}
          </button>
        </div>
      </div>

      <div className="cxray-metrics">
        <div className="cxray-metric">
          <span className="cxray-metric-label">
            ACTIVE CONTEXT
          </span>

          <strong>{formatTokens(activeTokens)}</strong>

          <span className="cxray-metric-sub">
            Tokens currently retained
          </span>
        </div>

        <div className="cxray-metric">
          <span className="cxray-metric-label">
            CONTEXT CAPACITY
          </span>

          <strong>{capacity.toLocaleString()}</strong>

          <span className="cxray-metric-sub">
            Simulated context window
          </span>
        </div>

        <div className="cxray-metric">
          <span className="cxray-metric-label">
            UTILIZATION
          </span>

          <strong>{utilization.toFixed(1)}%</strong>

          <span className="cxray-metric-sub">
            Context window occupancy
          </span>
        </div>

        <div className="cxray-metric">
          <span className="cxray-metric-label">
            RECLAIMABLE
          </span>

          <strong>
            {formatTokens(
              segments
                .filter(
                  (segment) =>
                    segment.status !== "retained"
                )
                .reduce(
                  (sum, segment) => sum + segment.tokens,
                  0
                )
            )}
          </strong>

          <span className="cxray-metric-sub">
            Compressed / discarded tokens
          </span>
        </div>
      </div>

      <div className="cxray-main-grid">
        <section className="cxray-panel">
          <div className="cxray-panel-header">
            <div>
              <h2>Context Composition</h2>

              <p>
                Token allocation across cognitive memory
                segments.
              </p>
            </div>

            <span className="cxray-live">
              <span className="cxray-live-dot" />
              LIVE MODEL
            </span>
          </div>

          <div className="cxray-capacity">
            <div className="cxray-capacity-labels">
              <span>
                {formatTokens(activeTokens)} /{" "}
                {capacity.toLocaleString()} tokens
              </span>

              <span>{utilization.toFixed(1)}%</span>
            </div>

            <div className="cxray-capacity-track">
              <div
                className="cxray-capacity-fill"
                style={{ width: `${utilization}%` }}
              />
            </div>
          </div>

          <div className="cxray-stack">
            {activeSegments.map((segment) => (
              <button
                key={segment.id}
                className={`cxray-stack-segment ${
                  selected === segment.id ? "selected" : ""
                }`}
                style={{
                  width: `${segmentPercentage(segment.tokens)}%`,
                  background: segment.color,
                }}
                onClick={() => setSelected(segment.id)}
                title={`${segment.name}: ${formatTokens(
                  segment.tokens
                )} tokens`}
              />
            ))}
          </div>

          <div className="cxray-legend">
            {segments.map((segment) => (
              <button
                key={segment.id}
                className={`cxray-legend-item ${
                  selected === segment.id ? "active" : ""
                } ${
                  segment.status === "discarded"
                    ? "discarded"
                    : ""
                }`}
                onClick={() => setSelected(segment.id)}
              >
                <span
                  className="cxray-legend-dot"
                  style={{ background: segment.color }}
                />

                <span>{segment.name}</span>

                <span className="cxray-legend-tokens">
                  {formatTokens(segment.tokens)}
                </span>
              </button>
            ))}
          </div>

          <div className="cxray-panel-footer">
            <span>
              {segments.length} context segments analyzed
            </span>

            <span>
              {formatTokens(totalTokens)} total tokens
            </span>
          </div>
        </section>

        <section className="cxray-panel cxray-inspector">
          <div className="cxray-panel-header">
            <div>
              <h2>Segment Inspector</h2>

              <p>Detailed segment-level analysis.</p>
            </div>
          </div>

          {selectedSegment && (
            <div className="cxray-inspector-content">
              <div
                className="cxray-inspector-icon"
                style={{
                  background: `${selectedSegment.color}20`,
                  color: selectedSegment.color,
                }}
              >
                ◈
              </div>

              <h3>{selectedSegment.name}</h3>

              <p className="cxray-inspector-description">
                {selectedSegment.description}
              </p>

              <div className="cxray-inspector-stats">
                <div>
                  <span>TOKEN COUNT</span>

                  <strong>
                    {formatTokens(selectedSegment.tokens)}
                  </strong>
                </div>

                <div>
                  <span>WINDOW SHARE</span>

                  <strong>
                    {segmentPercentage(
                      selectedSegment.tokens
                    ).toFixed(2)}
                    %
                  </strong>
                </div>
              </div>

              <div className="cxray-status-row">
                <span>Segment status</span>

                <span
                  className={`cxray-status ${selectedSegment.status}`}
                >
                  {selectedSegment.status.toUpperCase()}
                </span>
              </div>

              <div className="cxray-inspector-list">
                <h4>Segment contents</h4>

                {selectedSegment.content.map(
                  (item, index) => (
                    <div
                      className="cxray-content-item"
                      key={index}
                    >
                      <span>↳</span>

                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="cxray-panel cxray-breakdown">
        <div className="cxray-panel-header">
          <div>
            <h2>Context Breakdown</h2>

            <p>
              Detailed token distribution and segment health.
            </p>
          </div>
        </div>

        <div className="cxray-table-wrap">
          <table className="cxray-table">
            <thead>
              <tr>
                <th>SEGMENT</th>
                <th>TOKEN COUNT</th>
                <th>DISTRIBUTION</th>
                <th>STATUS</th>
                <th>WINDOW SHARE</th>
              </tr>
            </thead>

            <tbody>
              {segments.map((segment) => (
                <tr
                  key={segment.id}
                  onClick={() => setSelected(segment.id)}
                  className={
                    selected === segment.id
                      ? "selected-row"
                      : ""
                  }
                >
                  <td>
                    <div className="cxray-table-name">
                      <span
                        className="cxray-legend-dot"
                        style={{
                          background: segment.color,
                        }}
                      />

                      {segment.name}
                    </div>
                  </td>

                  <td>
                    {formatTokens(segment.tokens)}
                  </td>

                  <td>
                    <div className="cxray-table-bar">
                      <div
                        style={{
                          width: `${(segment.tokens / totalTokens) * 100}%`,
                          background: segment.color,
                        }}
                      />
                    </div>
                  </td>

                  <td>
                    <span
                      className={`cxray-status ${segment.status}`}
                    >
                      {segment.status}
                    </span>
                  </td>

                  <td>
                    {segmentPercentage(
                      segment.tokens
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cxray-panel cxray-pruning">
        <div className="cxray-pruning-heading">
          <div>
            <h2>Context Optimization Engine</h2>

            <p>
              Remove redundant contextual information
              while preserving task-critical state.
            </p>
          </div>

          <div className="cxray-pruning-symbol">
            ✦
          </div>
        </div>

        <div className="cxray-pruning-grid">
          <div className="cxray-pruning-card">
            <span>STRATEGY</span>

            <strong>Semantic Pruning</strong>

            <p>
              Prioritize relevant context and reduce
              redundant information.
            </p>
          </div>

          <div className="cxray-pruning-card">
            <span>PROTECTION</span>

            <strong>Goal Preservation</strong>

            <p>
              Retain task objectives and operational
              constraints.
            </p>
          </div>

          <div className="cxray-pruning-card">
            <span>EXECUTION</span>

            <strong>
              {segments.some(
                (segment) =>
                  segment.status === "discarded"
              )
                ? "Optimization Applied"
                : "Ready to Optimize"}
            </strong>

            <p>
              {segments.some(
                (segment) =>
                  segment.status === "discarded"
              )
                ? "Redundant context has been discarded in this simulation."
                : "Run the optimization engine to simulate context pruning."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}