"use client";

import { useState } from "react";

type Simulation = {
  id: number;
  name: string;
  description: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  status: "READY" | "RUNNING" | "VALIDATED" | "REJECTED";
};

const initialSimulations: Simulation[] = [
  {
    id: 1,
    name: "Database Mutation",
    description: "Simulates database write operations before committing them.",
    risk: "HIGH",
    status: "READY",
  },
  {
    id: 2,
    name: "API Transaction",
    description: "Validates external API requests and transaction outcomes.",
    risk: "MEDIUM",
    status: "READY",
  },
  {
    id: 3,
    name: "File System Operation",
    description: "Evaluates file creation, deletion and modification operations.",
    risk: "HIGH",
    status: "READY",
  },
  {
    id: 4,
    name: "Workflow Execution",
    description: "Evaluates proposed workflow changes before execution.",
    risk: "LOW",
    status: "READY",
  },
];

export default function ShadowSandbox() {
  const [simulations, setSimulations] = useState(initialSimulations);
  const [selected, setSelected] = useState(1);
  const [executed, setExecuted] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [running, setRunning] = useState(false);

  const selectedSimulation = simulations.find((s) => s.id === selected);

  const riskColor: Record<string, string> = {
    LOW: "#60a5fa",
    MEDIUM: "#fbbf24",
    HIGH: "#f87171",
  };

  function runSimulation() {
    if (running) return;

    setRunning(true);

    setTimeout(() => {
      setSimulations((prev) =>
        prev.map((sim) =>
          sim.id === selected
            ? {
                ...sim,
                status: sim.id === 3 ? "REJECTED" : "VALIDATED",
              }
            : sim
        )
      );

      setExecuted((prev) => prev + 1);

      if (selected === 3) {
        setRejected((prev) => prev + 1);
      } else {
        setApproved((prev) => prev + 1);
      }

      setRunning(false);
    }, 1200);
  }

  function resetSimulation() {
    setSimulations(initialSimulations);
    setExecuted(0);
    setApproved(0);
    setRejected(0);
    setRunning(false);
    setSelected(1);
  }

  function resetSelected() {
    setSimulations((prev) =>
      prev.map((sim) =>
        sim.id === selected ? { ...sim, status: "READY" } : sim
      )
    );
  }

  return (
    <div className="ss-page">
      <div className="ss-header">
        <div>
          <div className="ss-eyebrow">RUNTIME INTELLIGENCE / TRANSACTION SAFETY</div>
          <h1>Shadow Sandbox</h1>
          <p>Validate agent actions in an isolated environment before production execution.</p>
        </div>

        <div className="ss-live-badge">
          <span className="ss-live-dot" />
          ISOLATED ENVIRONMENT
        </div>
      </div>

      <div className="ss-metrics">
        <div className="ss-metric">
          <span className="ss-label">SHADOW EXECUTIONS</span>
          <div className="ss-value">{executed}</div>
          <span className="ss-sub">Simulation runs</span>
        </div>

        <div className="ss-metric">
          <span className="ss-label">VALIDATED</span>
          <div className="ss-value ss-green">{approved}</div>
          <span className="ss-sub">Safe execution candidates</span>
        </div>

        <div className="ss-metric">
          <span className="ss-label">REJECTED</span>
          <div className="ss-value ss-red">{rejected}</div>
          <span className="ss-sub">Unsafe execution candidates</span>
        </div>

        <div className="ss-metric">
          <span className="ss-label">COMMIT PROTECTION</span>
          <div className="ss-protection">
            <span className="ss-live-dot" />
            ACTIVE
          </div>
          <span className="ss-sub">Production isolation enabled</span>
        </div>
      </div>

      <div className="ss-main-grid">
        <div className="ss-panel">
          <div className="ss-panel-header">
            <div>
              <h2>Simulation Registry</h2>
              <p>Select an operation to simulate</p>
            </div>
            <span className="ss-count">{simulations.length} OPERATIONS</span>
          </div>

          <div className="ss-simulation-list">
            {simulations.map((sim) => (
              <button
                key={sim.id}
                className={`ss-simulation ${selected === sim.id ? "selected" : ""}`}
                onClick={() => setSelected(sim.id)}
              >
                <div className="ss-sim-icon">
                  {sim.id === 1 ? "◈" : sim.id === 2 ? "⇄" : sim.id === 3 ? "▤" : "⌘"}
                </div>

                <div className="ss-sim-content">
                  <div className="ss-sim-top">
                    <strong>{sim.name}</strong>
                    <span
                      className="ss-risk"
                      style={{
                        color: riskColor[sim.risk],
                        borderColor: riskColor[sim.risk],
                      }}
                    >
                      {sim.risk} RISK
                    </span>
                  </div>

                  <p>{sim.description}</p>

                  <div className="ss-sim-bottom">
                    <span
                      className={`ss-status ${sim.status.toLowerCase()}`}
                    >
                      {sim.status}
                    </span>
                    <span>Operation #{String(sim.id).padStart(3, "0")}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="ss-panel ss-inspector">
          <div className="ss-panel-header">
            <div>
              <h2>Execution Inspector</h2>
              <p>Simulation configuration and verdict</p>
            </div>
          </div>

          {selectedSimulation && (
            <div className="ss-inspector-body">
              <div className="ss-inspector-tag">SHADOW ENVIRONMENT</div>

              <h3>{selectedSimulation.name}</h3>

              <p className="ss-description">
                {selectedSimulation.description}
              </p>

              <div className="ss-info">
                <span>OPERATION ID</span>
                <strong>SHD-{String(selectedSimulation.id).padStart(4, "0")}</strong>
              </div>

              <div className="ss-info">
                <span>RISK CLASSIFICATION</span>
                <strong style={{ color: riskColor[selectedSimulation.risk] }}>
                  {selectedSimulation.risk}
                </strong>
              </div>

              <div className="ss-info">
                <span>EXECUTION MODE</span>
                <strong>SPECULATIVE / ISOLATED</strong>
              </div>

              <div className="ss-info">
                <span>VALIDATION STATUS</span>
                <strong
                  className={
                    selectedSimulation.status === "VALIDATED"
                      ? "ss-green"
                      : selectedSimulation.status === "REJECTED"
                      ? "ss-red"
                      : ""
                  }
                >
                  {selectedSimulation.status}
                </strong>
              </div>

              <div className="ss-safety-box">
                <div className="ss-safety-icon">◆</div>
                <div>
                  <strong>Production isolation</strong>
                  <p>
                    Simulation operates independently. No production state is
                    modified by this demonstration.
                  </p>
                </div>
              </div>

              <div className="ss-inspector-actions">
                <button
                  className="ss-reset-selected"
                  onClick={resetSelected}
                  disabled={running}
                >
                  Reset Operation
                </button>

                <button
                  className="ss-run-btn"
                  onClick={runSimulation}
                  disabled={running}
                >
                  {running ? "Simulating..." : "Run Shadow Execution →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ss-panel ss-comparison">
        <div className="ss-panel-header">
          <div>
            <h2>Shadow vs Production</h2>
            <p>Execution boundary and transaction safety comparison</p>
          </div>
        </div>

        <div className="ss-comparison-grid">
          <div className="ss-comparison-card">
            <div className="ss-comparison-top">
              <span className="ss-comparison-icon">◈</span>
              <span className="ss-comparison-tag">ISOLATED</span>
            </div>
            <h3>Shadow Execution</h3>
            <ul>
              <li><span>✓</span> Sandbox environment</li>
              <li><span>✓</span> Speculative operations</li>
              <li><span>✓</span> Pre-commit validation</li>
              <li><span>✓</span> Reversible simulation</li>
            </ul>
          </div>

          <div className="ss-comparison-divider">→</div>

          <div className="ss-comparison-card production">
            <div className="ss-comparison-top">
              <span className="ss-comparison-icon">⬡</span>
              <span className="ss-comparison-tag production-tag">CONTROLLED</span>
            </div>
            <h3>Production Execution</h3>
            <ul>
              <li><span>◆</span> Real system state</li>
              <li><span>◆</span> Verified operations only</li>
              <li><span>◆</span> Policy enforcement</li>
              <li><span>◆</span> Runtime commit control</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ss-bottom">
        <div>
          <h3>Shadow Transaction Engine</h3>
          <p>Evaluate speculative operations before allowing execution to proceed.</p>
        </div>

        <button className="ss-reset-all" onClick={resetSimulation}>
          ↻ Reset Sandbox
        </button>
      </div>
    </div>
  );
}