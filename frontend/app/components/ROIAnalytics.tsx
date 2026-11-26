"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const reliabilityData = [
  { day: "Mon", baseline: 72, reverto: 94 },
  { day: "Tue", baseline: 68, reverto: 96 },
  { day: "Wed", baseline: 75, reverto: 92 },
  { day: "Thu", baseline: 70, reverto: 97 },
  { day: "Fri", baseline: 64, reverto: 95 },
  { day: "Sat", baseline: 78, reverto: 98 },
  { day: "Sun", baseline: 71, reverto: 96 },
];

const interventionData = [
  { name: "Loop Prevention", value: 32 },
  { name: "Context Control", value: 24 },
  { name: "Drift Detection", value: 18 },
  { name: "Tool Validation", value: 15 },
  { name: "Other", value: 11 },
];

const executionData = [
  { name: "Week 01", success: 68, recovery: 12 },
  { name: "Week 02", success: 74, recovery: 16 },
  { name: "Week 03", success: 81, recovery: 21 },
  { name: "Week 04", success: 88, recovery: 27 },
  { name: "Week 05", success: 91, recovery: 32 },
  { name: "Week 06", success: 96, recovery: 38 },
];

const metrics = {
  "24H": {
    reliability: "96.8%",
    recovery: "84.2%",
    failures: "−71.4%",
    savings: "$1,284",
  },
  "7D": {
    reliability: "94.6%",
    recovery: "79.8%",
    failures: "−68.2%",
    savings: "$8,460",
  },
  "30D": {
    reliability: "92.4%",
    recovery: "76.1%",
    failures: "−64.7%",
    savings: "$34,920",
  },
};

export default function ROIAnalytics() {
  const [timeRange, setTimeRange] = useState<"24H" | "7D" | "30D">("7D");
  const [comparison, setComparison] = useState(true);

  const current = metrics[timeRange];

  return (
    <div className="roi-page">
      <header className="roi-header">
        <div>
          <div className="roi-eyebrow">
            REVERTO AI / INTELLIGENCE / PERFORMANCE ECONOMICS
          </div>
          <h1>Reliability Intelligence</h1>
          <p>
            Quantify agent stability, runtime interventions and operational
            value.
          </p>
        </div>

        <div className="roi-header-controls">
          <div className="roi-range">
            {(["24H", "7D", "30D"] as const).map((range) => (
              <button
                key={range}
                className={timeRange === range ? "active" : ""}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            className={`roi-comparison-toggle ${
              comparison ? "active" : ""
            }`}
            onClick={() => setComparison((prev) => !prev)}
          >
            {comparison ? "Comparison ON" : "Comparison OFF"}
          </button>
        </div>
      </header>

      <section className="roi-hero">
        <div className="roi-hero-main">
          <div className="roi-hero-label">
            <span className="roi-live-dot" />
            SYSTEM PERFORMANCE INDEX
          </div>

          <div className="roi-hero-score">
            <span>{current.reliability}</span>
            <div className="roi-score-change">
              <span>↗</span> +22.6%
              <small>vs unprotected execution</small>
            </div>
          </div>

          <div className="roi-hero-description">
            Reliability measured across simulated protected agent execution
            cycles.
          </div>

          <div className="roi-progress-track">
            <div
              className="roi-progress-fill"
              style={{
                width: current.reliability,
              }}
            />
          </div>

          <div className="roi-progress-labels">
            <span>0</span>
            <span>RELIABILITY INDEX</span>
            <span>100</span>
          </div>
        </div>

        <div className="roi-hero-side">
          <div className="roi-hero-side-label">PROJECTED OPERATIONAL VALUE</div>
          <div className="roi-hero-money">{current.savings}</div>
          <div className="roi-hero-money-sub">
            Estimated cost avoidance for the selected period
          </div>

          <div className="roi-hero-divider" />

          <div className="roi-hero-side-row">
            <span>Recovery efficiency</span>
            <strong>{current.recovery}</strong>
          </div>

          <div className="roi-hero-side-row">
            <span>Failure reduction</span>
            <strong>{current.failures}</strong>
          </div>
        </div>
      </section>

      <section className="roi-metric-row">
        <div className="roi-metric">
          <div className="roi-metric-top">
            <span>RECOVERY RATE</span>
            <span className="roi-metric-symbol">↗</span>
          </div>
          <div className="roi-metric-value">{current.recovery}</div>
          <div className="roi-metric-caption">
            Interrupted executions successfully recovered
          </div>
          <div className="roi-metric-bottom">
            <span className="roi-metric-indicator positive" />
            Runtime resilience
          </div>
        </div>

        <div className="roi-metric">
          <div className="roi-metric-top">
            <span>FAILURE REDUCTION</span>
            <span className="roi-metric-symbol">⌁</span>
          </div>
          <div className="roi-metric-value">{current.failures}</div>
          <div className="roi-metric-caption">
            Reduction compared with baseline execution
          </div>
          <div className="roi-metric-bottom">
            <span className="roi-metric-indicator positive" />
            Failure containment
          </div>
        </div>

        <div className="roi-metric">
          <div className="roi-metric-top">
            <span>ESTIMATED SAVINGS</span>
            <span className="roi-metric-symbol">$</span>
          </div>
          <div className="roi-metric-value">{current.savings}</div>
          <div className="roi-metric-caption">
            Simulated operational cost avoidance
          </div>
          <div className="roi-metric-bottom">
            <span className="roi-metric-indicator positive" />
            Economic impact
          </div>
        </div>

        <div className="roi-metric">
          <div className="roi-metric-top">
            <span>POLICY INTERVENTIONS</span>
            <span className="roi-metric-symbol">⊘</span>
          </div>
          <div className="roi-metric-value">142</div>
          <div className="roi-metric-caption">
            Runtime anomalies intercepted in simulation
          </div>
          <div className="roi-metric-bottom">
            <span className="roi-metric-indicator positive" />
            Preventive actions
          </div>
        </div>
      </section>

      <section className="roi-chart-section">
        <div className="roi-section-heading">
          <div>
            <span className="roi-section-tag">01 / PERFORMANCE ANALYSIS</span>
            <h2>Execution Reliability</h2>
            <p>Protected and unprotected agent performance.</p>
          </div>

          <div className="roi-legend">
            <span className="roi-legend-item">
              <i className="roi-legend-baseline" />
              Baseline
            </span>
            {comparison && (
              <span className="roi-legend-item">
                <i className="roi-legend-reverto" />
                Reverto
              </span>
            )}
          </div>
        </div>

        <div className="roi-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reliabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263247" />
              <XAxis
                dataKey="day"
                stroke="#8a96aa"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#8a96aa"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#101827",
                  border: "1px solid #35445c",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Baseline"
                stroke="#8b95a8"
                fill="#8b95a8"
                fillOpacity={0.08}
                strokeWidth={2}
              />
              {comparison && (
                <Area
                  type="monotone"
                  dataKey="reverto"
                  name="Reverto"
                  stroke="#55d6a2"
                  fill="#55d6a2"
                  fillOpacity={0.12}
                  strokeWidth={2.5}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="roi-analysis-grid">
        <div className="roi-chart-panel">
          <div className="roi-section-heading">
            <div>
              <span className="roi-section-tag">02 / INTERVENTION ANALYSIS</span>
              <h2>Failure Containment</h2>
              <p>Distribution of simulated runtime protection events.</p>
            </div>
          </div>

          <div className="roi-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={interventionData}
                layout="vertical"
                margin={{ left: 12, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#263247"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#8a96aa"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  stroke="#c2ccdc"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    background: "#101827",
                    border: "1px solid #35445c",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" name="Interventions" radius={[0, 5, 5, 0]}>
                  {interventionData.map((_, index) => (
                    <Cell
                      key={index}
                      fillOpacity={0.9 - index * 0.12}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="roi-chart-panel">
          <div className="roi-section-heading">
            <div>
              <span className="roi-section-tag">03 / RECOVERY PROGRESSION</span>
              <h2>Runtime Resilience</h2>
              <p>Success and recovery performance over six periods.</p>
            </div>
          </div>

          <div className="roi-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#263247" />
                <XAxis
                  dataKey="name"
                  stroke="#8a96aa"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#8a96aa"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#101827",
                    border: "1px solid #35445c",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="success"
                  name="Execution success"
                  fill="#55d6a2"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="recovery"
                  name="Recovery contribution"
                  fill="#7e91f5"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="roi-bottom-analysis">
        <div className="roi-bottom-heading">
          <span className="roi-section-tag">04 / VALUE MODEL</span>
          <h2>Operational Impact Assessment</h2>
          <p>
            Illustrative model comparing unprotected execution with runtime
            governance enabled.
          </p>
        </div>

        <div className="roi-impact-table">
          <div className="roi-impact-row roi-impact-head">
            <span>PERFORMANCE INDICATOR</span>
            <span>BASELINE</span>
            <span>REVERTO MODEL</span>
            <span>DELTA</span>
          </div>

          <div className="roi-impact-row">
            <span>Execution success</span>
            <span>72.0%</span>
            <span>94.6%</span>
            <span className="roi-delta-positive">+22.6%</span>
          </div>

          <div className="roi-impact-row">
            <span>Failure incidence</span>
            <span>28.0%</span>
            <span>9.4%</span>
            <span className="roi-delta-positive">−66.4%</span>
          </div>

          <div className="roi-impact-row">
            <span>Recovery capability</span>
            <span>12.0%</span>
            <span>79.8%</span>
            <span className="roi-delta-positive">+67.8%</span>
          </div>

          <div className="roi-impact-row">
            <span>Governance coverage</span>
            <span>0.0%</span>
            <span>86.0%</span>
            <span className="roi-delta-positive">+86.0%</span>
          </div>

          <div className="roi-impact-row">
            <span>Estimated cost avoidance</span>
            <span>$0</span>
            <span>$8,460</span>
            <span className="roi-delta-positive">+$8,460</span>
          </div>
        </div>
      </section>

      <footer className="roi-footer">
        <div>
          <span className="roi-footer-dot" />
          ANALYTICS ENGINE / SIMULATED DATA
        </div>
        <span>
          ROI estimates are illustrative · Not connected to production telemetry
        </span>
      </footer>
    </div>
  );
}