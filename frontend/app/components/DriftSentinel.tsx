"use client";

import { useState } from "react";

type DriftEvent = {
  id: number;
  time: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  action: string;
};

const initialEvents: DriftEvent[] = [
  {
    id: 1,
    time: "10:42:08",
    type: "GOAL DEVIATION",
    severity: "HIGH",
    description: "Agent shifted from original objective while researching secondary information.",
    action: "Objective realignment",
  },
  {
    id: 2,
    time: "10:42:11",
    type: "SEMANTIC LOOP",
    severity: "CRITICAL",
    description: "Repeated search pattern detected across 4 consecutive reasoning cycles.",
    action: "Loop termination",
  },
  {
    id: 3,
    time: "10:42:15",
    type: "CONTEXT DRIFT",
    severity: "MEDIUM",
    description: "Low relevance context accumulated in working memory.",
    action: "Context pruning",
  },
  {
    id: 4,
    time: "10:42:19",
    type: "TOOL REDUNDANCY",
    severity: "LOW",
    description: "A previously executed tool operation was requested again.",
    action: "Execution deduplication",
  },
];

export default function DriftSentinel() {
  const [events, setEvents] = useState(initialEvents);
  const [monitoring, setMonitoring] = useState(true);
  const [blocked, setBlocked] = useState(2);
  const [selected, setSelected] = useState<number | null>(1);

  const selectedEvent = events.find((event) => event.id === selected);

  function interceptAll() {
    setBlocked((prev) => prev + events.length);
    setEvents([]);
    setSelected(null);
  }

  function restore() {
    setEvents(initialEvents);
    setSelected(1);
  }

  const severityColor: Record<string, string> = {
    LOW: "#60a5fa",
    MEDIUM: "#fbbf24",
    HIGH: "#fb923c",
    CRITICAL: "#f87171",
  };

  return (
    <div className="ds-page">
      <div className="ds-header">
        <div>
          <div className="ds-eyebrow">RUNTIME INTELLIGENCE / MONITORING</div>
          <h1>Drift Sentinel</h1>
          <p>Detect, evaluate and intercept behavioral deviation during agent execution.</p>
        </div>
        <button
          className={`ds-monitor ${monitoring ? "active" : ""}`}
          onClick={() => setMonitoring(!monitoring)}
        >
          <span className="ds-live-dot" />
          {monitoring ? "MONITORING ACTIVE" : "MONITORING PAUSED"}
        </button>
      </div>

      <div className="ds-metrics">
        <div className="ds-metric">
          <span className="ds-metric-label">ALIGNMENT SCORE</span>
          <div className="ds-metric-value">84.2<span>%</span></div>
          <div className="ds-metric-sub">Objective adherence</div>
        </div>

        <div className="ds-metric">
          <span className="ds-metric-label">DRIFT EVENTS</span>
          <div className="ds-metric-value">{events.length}<span> detected</span></div>
          <div className="ds-metric-sub">Current execution</div>
        </div>

        <div className="ds-metric">
          <span className="ds-metric-label">INTERCEPTED</span>
          <div className="ds-metric-value">{blocked}<span> events</span></div>
          <div className="ds-metric-sub">Prevented from propagating</div>
        </div>

        <div className="ds-metric">
          <span className="ds-metric-label">RUNTIME STATUS</span>
          <div className="ds-runtime">
            <span className="ds-live-dot" />
            {monitoring ? "PROTECTED" : "PAUSED"}
          </div>
          <div className="ds-metric-sub">Sentinel enforcement</div>
        </div>
      </div>

      <div className="ds-main-grid">
        <div className="ds-panel ds-events-panel">
          <div className="ds-panel-header">
            <div>
              <h2>Drift Event Stream</h2>
              <p>Behavioral anomalies detected during execution</p>
            </div>
            <span className="ds-counter">{events.length} EVENTS</span>
          </div>

          <div className="ds-event-list">
            {events.length === 0 ? (
              <div className="ds-empty">
                <div className="ds-empty-icon">✓</div>
                <h3>Execution stabilized</h3>
                <p>All detected anomalies have been intercepted.</p>
              </div>
            ) : (
              events.map((event) => (
                <button
                  key={event.id}
                  className={`ds-event ${selected === event.id ? "selected" : ""}`}
                  onClick={() => setSelected(event.id)}
                >
                  <div
                    className="ds-event-indicator"
                    style={{ background: severityColor[event.severity] }}
                  />
                  <div className="ds-event-content">
                    <div className="ds-event-top">
                      <span className="ds-event-type">{event.type}</span>
                      <span
                        className="ds-severity"
                        style={{
                          color: severityColor[event.severity],
                          borderColor: severityColor[event.severity],
                        }}
                      >
                        {event.severity}
                      </span>
                    </div>
                    <p>{event.description}</p>
                    <div className="ds-event-bottom">
                      <span>{event.time}</span>
                      <span>↳ {event.action}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="ds-panel ds-inspector">
          <div className="ds-panel-header">
            <div>
              <h2>Event Inspector</h2>
              <p>Detailed anomaly analysis</p>
            </div>
          </div>

          {selectedEvent ? (
            <div className="ds-inspector-content">
              <div
                className="ds-inspector-severity"
                style={{
                  color: severityColor[selectedEvent.severity],
                  borderColor: severityColor[selectedEvent.severity],
                }}
              >
                {selectedEvent.severity} SEVERITY
              </div>

              <h3>{selectedEvent.type}</h3>
              <p className="ds-inspector-description">
                {selectedEvent.description}
              </p>

              <div className="ds-inspector-section">
                <span className="ds-section-label">DETECTION TIME</span>
                <strong>{selectedEvent.time}</strong>
              </div>

              <div className="ds-inspector-section">
                <span className="ds-section-label">DETECTION ENGINE</span>
                <strong>Semantic Runtime Analyzer</strong>
              </div>

              <div className="ds-inspector-section">
                <span className="ds-section-label">RECOMMENDED ACTION</span>
                <strong>{selectedEvent.action}</strong>
              </div>

              <div className="ds-inspector-section">
                <span className="ds-section-label">INTERCEPTION STATUS</span>
                <strong className="ds-status-protected">
                  ● Contained
                </strong>
              </div>

              <div className="ds-inspector-note">
                <span>◆</span>
                Anomaly isolated before it could compromise the primary execution objective.
              </div>
            </div>
          ) : (
            <div className="ds-inspector-empty">
              Select an event to inspect its details.
            </div>
          )}
        </div>
      </div>

      <div className="ds-panel ds-timeline">
        <div className="ds-panel-header">
          <div>
            <h2>Execution Drift Timeline</h2>
            <p>Behavioral stability across runtime checkpoints</p>
          </div>
        </div>

        <div className="ds-timeline-track">
          {["INITIALIZATION", "PLANNING", "EXECUTION", "ANALYSIS", "FINALIZATION"].map(
            (stage, index) => (
              <div className="ds-timeline-step" key={stage}>
                <div className={`ds-timeline-node ${index === 2 ? "warning" : "stable"}`}>
                  {index === 2 ? "!" : "✓"}
                </div>
                <div className="ds-timeline-stage">{stage}</div>
                <div className="ds-timeline-time">
                  {["10:42:00", "10:42:04", "10:42:11", "10:42:17", "10:42:22"][index]}
                </div>
                {index < 4 && <div className="ds-timeline-line" />}
              </div>
            )
          )}
        </div>
      </div>

      <div className="ds-bottom-actions">
        <div>
          <h3>Interception Engine</h3>
          <p>Contain detected behavioral anomalies and stabilize the execution.</p>
        </div>

        <div className="ds-action-buttons">
          <button className="ds-secondary-btn" onClick={restore}>
            Reset Simulation
          </button>
          <button
            className="ds-primary-btn"
            onClick={interceptAll}
            disabled={events.length === 0}
          >
            Intercept All Events →
          </button>
        </div>
      </div>
    </div>
  );
}