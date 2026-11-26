"use client";

import { useState } from "react";

type Policy = {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  enabled: boolean;
  mode: "BLOCK" | "WARN" | "OBSERVE";
  threshold: number;
};

const initialPolicies: Policy[] = [
  {
    id: "POL-001",
    name: "Infinite Loop Prevention",
    category: "Execution",
    description: "Detect repetitive execution patterns across agent cycles.",
    severity: "Critical",
    enabled: true,
    mode: "BLOCK",
    threshold: 4,
  },
  {
    id: "POL-002",
    name: "Goal Deviation Guard",
    category: "Alignment",
    description: "Prevent execution from drifting away from the primary objective.",
    severity: "Critical",
    enabled: true,
    mode: "BLOCK",
    threshold: 75,
  },
  {
    id: "POL-003",
    name: "Context Overflow Protection",
    category: "Memory",
    description: "Trigger context management before exceeding token capacity.",
    severity: "High",
    enabled: true,
    mode: "WARN",
    threshold: 85,
  },
  {
    id: "POL-004",
    name: "Tool Execution Limit",
    category: "Execution",
    description: "Restrict excessive tool calls during a single execution.",
    severity: "High",
    enabled: true,
    mode: "BLOCK",
    threshold: 12,
  },
  {
    id: "POL-005",
    name: "External Write Validation",
    category: "Transaction",
    description: "Require shadow validation before external write operations.",
    severity: "Critical",
    enabled: true,
    mode: "BLOCK",
    threshold: 1,
  },
  {
    id: "POL-006",
    name: "Low Confidence Alert",
    category: "Quality",
    description: "Notify the runtime when confidence falls below the threshold.",
    severity: "Medium",
    enabled: false,
    mode: "WARN",
    threshold: 60,
  },
  {
    id: "POL-007",
    name: "Redundant Tool Call Filter",
    category: "Execution",
    description: "Identify repeated tool requests within a short execution window.",
    severity: "Medium",
    enabled: true,
    mode: "OBSERVE",
    threshold: 3,
  },
];

const categories = ["All", "Execution", "Alignment", "Memory", "Transaction", "Quality"];

export default function PolicyLab() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [selectedId, setSelectedId] = useState("POL-001");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [testScenario, setTestScenario] = useState("loop");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testRunning, setTestRunning] = useState(false);
  const [revision, setRevision] = useState(1);

  const selectedPolicy = policies.find((p) => p.id === selectedId);

  const filteredPolicies = policies.filter((policy) => {
    const categoryMatch = filter === "All" || policy.category === filter;
    const searchMatch =
      policy.name.toLowerCase().includes(search.toLowerCase()) ||
      policy.id.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const enabledCount = policies.filter((p) => p.enabled).length;
  const blockedCount = policies.filter(
    (p) => p.enabled && p.mode === "BLOCK"
  ).length;

  function updatePolicy(id: string, updates: Partial<Policy>) {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id ? { ...policy, ...updates } : policy
      )
    );
    setRevision((prev) => prev + 1);
    setTestResult(null);
  }

  function runTest() {
    if (!selectedPolicy) return;

    setTestRunning(true);
    setTestResult(null);

    setTimeout(() => {
      const scenarioName =
        testScenario === "loop"
          ? "Repeated execution cycle"
          : testScenario === "drift"
          ? "Objective deviation"
          : testScenario === "write"
          ? "Unverified external write"
          : "Context capacity overload";

      const compatible =
        (testScenario === "loop" && selectedPolicy.category === "Execution") ||
        (testScenario === "drift" && selectedPolicy.category === "Alignment") ||
        (testScenario === "write" && selectedPolicy.category === "Transaction") ||
        (testScenario === "context" && selectedPolicy.category === "Memory");

      if (!selectedPolicy.enabled) {
        setTestResult(
          `POLICY INACTIVE — ${scenarioName} was evaluated, but ${selectedPolicy.id} is disabled.`
        );
      } else if (!compatible) {
        setTestResult(
          `NO MATCH — ${scenarioName} does not directly match the selected policy category.`
        );
      } else if (selectedPolicy.mode === "BLOCK") {
        setTestResult(
          `BLOCK ACTION — ${scenarioName} matched ${selectedPolicy.id}. Execution would be intercepted.`
        );
      } else if (selectedPolicy.mode === "WARN") {
        setTestResult(
          `WARNING — ${scenarioName} matched ${selectedPolicy.id}. Execution would continue with an alert.`
        );
      } else {
        setTestResult(
          `OBSERVATION — ${scenarioName} matched ${selectedPolicy.id}. The event would be logged without interception.`
        );
      }

      setTestRunning(false);
    }, 900);
  }

  function resetPolicies() {
    setPolicies(initialPolicies);
    setSelectedId("POL-001");
    setFilter("All");
    setSearch("");
    setTestResult(null);
    setRevision(1);
  }

  return (
    <div className="pl-page">
      <div className="pl-topbar">
        <div>
          <div className="pl-breadcrumb">
            REVERTO AI <span>/</span> GOVERNANCE <span>/</span> POLICY LAB
          </div>
          <h1>Policy Engineering</h1>
          <p>Define, configure and test runtime enforcement boundaries.</p>
        </div>

        <div className="pl-top-actions">
          <div className="pl-version">
            <span className="pl-version-dot" />
            POLICY SET v1.{revision}
          </div>
          <button className="pl-reset" onClick={resetPolicies}>
            Restore Defaults
          </button>
        </div>
      </div>

      <div className="pl-overview-strip">
        <div className="pl-overview-item">
          <span className="pl-overview-icon">⌘</span>
          <div>
            <span className="pl-overview-label">REGISTERED RULES</span>
            <strong>{policies.length.toString().padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="pl-overview-item">
          <span className="pl-overview-icon pl-icon-green">✓</span>
          <div>
            <span className="pl-overview-label">ACTIVE POLICIES</span>
            <strong>{enabledCount}</strong>
          </div>
        </div>

        <div className="pl-overview-item">
          <span className="pl-overview-icon pl-icon-red">⊘</span>
          <div>
            <span className="pl-overview-label">BLOCKING RULES</span>
            <strong>{blockedCount}</strong>
          </div>
        </div>

        <div className="pl-overview-item">
          <span className="pl-overview-icon pl-icon-purple">◇</span>
          <div>
            <span className="pl-overview-label">ENGINE STATUS</span>
            <strong className="pl-engine-status">OPERATIONAL</strong>
          </div>
        </div>
      </div>

      <div className="pl-workbench">
        <aside className="pl-registry">
          <div className="pl-registry-header">
            <div className="pl-registry-title">
              <span className="pl-registry-symbol">▤</span>
              <div>
                <h2>Rule Registry</h2>
                <span>{policies.length} registered policies</span>
              </div>
            </div>
          </div>

          <div className="pl-search">
            <span>⌕</span>
            <input
              placeholder="Find policy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pl-category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`pl-category ${filter === category ? "active" : ""}`}
                onClick={() => setFilter(category)}
              >
                {category}
                <span>
                  {category === "All"
                    ? policies.length
                    : policies.filter((p) => p.category === category).length}
                </span>
              </button>
            ))}
          </div>

          <div className="pl-registry-list">
            {filteredPolicies.map((policy) => (
              <button
                key={policy.id}
                className={`pl-rule-item ${
                  selectedId === policy.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedId(policy.id);
                  setTestResult(null);
                }}
              >
                <div className="pl-rule-item-top">
                  <span className="pl-rule-id">{policy.id}</span>
                  <span
                    className={`pl-rule-indicator ${
                      policy.enabled ? "enabled" : "disabled"
                    }`}
                  />
                </div>

                <strong>{policy.name}</strong>

                <div className="pl-rule-item-bottom">
                  <span>{policy.category}</span>
                  <span className={`pl-mode-label ${policy.mode.toLowerCase()}`}>
                    {policy.mode}
                  </span>
                </div>
              </button>
            ))}

            {filteredPolicies.length === 0 && (
              <div className="pl-no-results">No matching policies.</div>
            )}
          </div>

          <div className="pl-registry-footer">
            <span className="pl-footer-dot" />
            POLICY ENGINE CONNECTED
          </div>
        </aside>

        <main className="pl-editor">
          {selectedPolicy && (
            <>
              <div className="pl-editor-header">
                <div>
                  <div className="pl-editor-breadcrumb">
                    RULE CONFIGURATION <span>/</span> {selectedPolicy.id}
                  </div>
                  <h2>{selectedPolicy.name}</h2>
                  <p>{selectedPolicy.description}</p>
                </div>

                <div
                  className={`pl-toggle ${
                    selectedPolicy.enabled ? "on" : ""
                  }`}
                  onClick={() =>
                    updatePolicy(selectedPolicy.id, {
                      enabled: !selectedPolicy.enabled,
                    })
                  }
                  role="switch"
                  aria-checked={selectedPolicy.enabled}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      updatePolicy(selectedPolicy.id, {
                        enabled: !selectedPolicy.enabled,
                      });
                    }
                  }}
                >
                  <span />
                </div>
              </div>

              <div className="pl-editor-content">
                <div className="pl-section">
                  <div className="pl-section-heading">
                    <span className="pl-section-number">01</span>
                    <div>
                      <h3>Policy Identity</h3>
                      <p>Policy metadata and classification</p>
                    </div>
                  </div>

                  <div className="pl-identity-grid">
                    <div className="pl-field">
                      <label>POLICY IDENTIFIER</label>
                      <div className="pl-input-static">
                        {selectedPolicy.id}
                      </div>
                    </div>

                    <div className="pl-field">
                      <label>POLICY CATEGORY</label>
                      <div className="pl-input-static">
                        {selectedPolicy.category}
                      </div>
                    </div>

                    <div className="pl-field">
                      <label>SEVERITY</label>
                      <div className="pl-input-static">
                        <span
                          className={`pl-severity-dot ${selectedPolicy.severity.toLowerCase()}`}
                        />
                        {selectedPolicy.severity}
                      </div>
                    </div>

                    <div className="pl-field">
                      <label>POLICY STATE</label>
                      <div className="pl-input-static">
                        <span
                          className={`pl-state-dot ${
                            selectedPolicy.enabled ? "active" : "inactive"
                          }`}
                        />
                        {selectedPolicy.enabled ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pl-section">
                  <div className="pl-section-heading">
                    <span className="pl-section-number">02</span>
                    <div>
                      <h3>Enforcement Strategy</h3>
                      <p>Define how the runtime responds to violations</p>
                    </div>
                  </div>

                  <div className="pl-enforcement-options">
                    {(["BLOCK", "WARN", "OBSERVE"] as const).map((mode) => (
                      <button
                        key={mode}
                        className={`pl-enforcement-option ${
                          selectedPolicy.mode === mode ? "selected" : ""
                        } ${mode.toLowerCase()}`}
                        onClick={() =>
                          updatePolicy(selectedPolicy.id, { mode })
                        }
                      >
                        <div className="pl-option-icon">
                          {mode === "BLOCK"
                            ? "⊘"
                            : mode === "WARN"
                            ? "△"
                            : "◉"}
                        </div>
                        <div>
                          <strong>{mode}</strong>
                          <p>
                            {mode === "BLOCK"
                              ? "Intercept and prevent execution."
                              : mode === "WARN"
                              ? "Alert without stopping execution."
                              : "Record event for runtime analysis."}
                          </p>
                        </div>
                        <div className="pl-radio">
                          {selectedPolicy.mode === mode && <span />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pl-section">
                  <div className="pl-section-heading">
                    <span className="pl-section-number">03</span>
                    <div>
                      <h3>Detection Threshold</h3>
                      <p>Configure the policy activation threshold</p>
                    </div>
                  </div>

                  <div className="pl-threshold-box">
                    <div className="pl-threshold-top">
                      <label>THRESHOLD VALUE</label>
                      <div className="pl-threshold-value">
                        {selectedPolicy.threshold}
                      </div>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={selectedPolicy.threshold}
                      onChange={(e) =>
                        updatePolicy(selectedPolicy.id, {
                          threshold: Number(e.target.value),
                        })
                      }
                      className="pl-slider"
                    />

                    <div className="pl-slider-labels">
                      <span>1 — MINIMUM</span>
                      <span>100 — MAXIMUM</span>
                    </div>

                    <div className="pl-threshold-note">
                      Threshold changes are simulated locally and are not
                      connected to a production runtime.
                    </div>
                  </div>
                </div>

                <div className="pl-section pl-section-last">
                  <div className="pl-section-heading">
                    <span className="pl-section-number">04</span>
                    <div>
                      <h3>Runtime Behavior</h3>
                      <p>Policy response and interception logic</p>
                    </div>
                  </div>

                  <div className="pl-behavior-flow">
                    <div className="pl-flow-step">
                      <span className="pl-flow-number">01</span>
                      <strong>Detect</strong>
                      <span>Runtime anomaly</span>
                    </div>

                    <span className="pl-flow-arrow">→</span>

                    <div className="pl-flow-step">
                      <span className="pl-flow-number">02</span>
                      <strong>Evaluate</strong>
                      <span>Policy conditions</span>
                    </div>

                    <span className="pl-flow-arrow">→</span>

                    <div className="pl-flow-step response">
                      <span className="pl-flow-number">03</span>
                      <strong>
                        {selectedPolicy.mode === "BLOCK"
                          ? "Intercept"
                          : selectedPolicy.mode === "WARN"
                          ? "Alert"
                          : "Log"}
                      </strong>
                      <span>Enforcement response</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <section className="pl-testing-console">
        <div className="pl-console-header">
          <div>
            <div className="pl-console-eyebrow">
              <span className="pl-console-icon">▷</span>
              POLICY VALIDATION TERMINAL
            </div>
            <h2>Test Enforcement</h2>
            <p>Evaluate the selected rule against a simulated runtime scenario.</p>
          </div>

          <div className="pl-console-status">
            <span />
            LOCAL SIMULATION
          </div>
        </div>

        <div className="pl-console-body">
          <div className="pl-test-config">
            <label>SIMULATION SCENARIO</label>
            <select
              value={testScenario}
              onChange={(e) => {
                setTestScenario(e.target.value);
                setTestResult(null);
              }}
            >
              <option value="loop">Repeated Execution Cycle</option>
              <option value="drift">Goal Deviation Event</option>
              <option value="write">Unverified External Write</option>
              <option value="context">Context Capacity Overload</option>
            </select>

            <div className="pl-test-target">
              <span>TEST TARGET</span>
              <strong>{selectedPolicy?.id ?? "--"}</strong>
            </div>

            <button
              className="pl-run-test"
              onClick={runTest}
              disabled={testRunning || !selectedPolicy}
            >
              {testRunning ? (
                <>◌ &nbsp;Evaluating Rule...</>
              ) : (
                <>▶ &nbsp;Run Policy Test</>
              )}
            </button>
          </div>

          <div className="pl-terminal">
            <div className="pl-terminal-top">
              <div className="pl-terminal-dots">
                <span />
                <span />
                <span />
              </div>
              <span>POLICY_EVALUATOR / OUTPUT</span>
            </div>

            <div className="pl-terminal-content">
              <div className="pl-terminal-line">
                <span className="pl-terminal-prompt">&gt;</span>
                <span>Policy evaluator initialized.</span>
              </div>

              <div className="pl-terminal-line">
                <span className="pl-terminal-prompt">&gt;</span>
                <span>Target: {selectedPolicy?.id ?? "--"}</span>
              </div>

              <div className="pl-terminal-line">
                <span className="pl-terminal-prompt">&gt;</span>
                <span>Enforcement: {selectedPolicy?.mode ?? "--"}</span>
              </div>

              <div className="pl-terminal-line">
                <span className="pl-terminal-prompt">&gt;</span>
                <span>Threshold: {selectedPolicy?.threshold ?? "--"}</span>
              </div>

              {testRunning && (
                <div className="pl-terminal-result processing">
                  <span>◌</span> Evaluating scenario against policy conditions...
                </div>
              )}

              {testResult && (
                <div
                  className={`pl-terminal-result ${
                    testResult.startsWith("BLOCK ACTION")
                      ? "blocked"
                      : testResult.startsWith("WARNING")
                      ? "warning"
                      : testResult.startsWith("OBSERVATION")
                      ? "observation"
                      : "neutral"
                  }`}
                >
                  <span>
                    {testResult.startsWith("BLOCK ACTION")
                      ? "⊘"
                      : testResult.startsWith("WARNING")
                      ? "△"
                      : testResult.startsWith("OBSERVATION")
                      ? "◉"
                      : "○"}
                  </span>
                  {testResult}
                </div>
              )}

              {!testResult && !testRunning && (
                <div className="pl-terminal-placeholder">
                  Awaiting scenario execution...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="pl-bottom-bar">
        <div>
          <span className="pl-bottom-indicator" />
          POLICY ENGINE READY
        </div>
        <span>CONFIGURATION IS SIMULATED · NO LIVE AGENT CONNECTION</span>
      </div>
    </div>
  );
}