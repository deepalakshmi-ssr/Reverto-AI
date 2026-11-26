'use client';

import { useState } from 'react';
import {
  GitBranch,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  XCircle,
  RefreshCw
} from 'lucide-react';

type NodeStatus = 'committed' | 'failed' | 'pruned' | 'recovered' | 'pending';

type CognitiveNode = {
  id: string;
  title: string;
  description: string;
  status: NodeStatus;
  parent: string | null;
  action: string;
  timestamp: string;
};

const initialNodes: CognitiveNode[] = [
  {
    id: 'ROOT',
    title: 'User Goal',
    description: 'Original objective provided by the user.',
    status: 'committed',
    parent: null,
    action: 'Initialize execution context',
    timestamp: '10:00:00'
  },
  {
    id: 'N01',
    title: 'Context Analysis',
    description: 'Agent analyses the request and identifies relevant context.',
    status: 'committed',
    parent: 'ROOT',
    action: 'Retrieve and inspect context',
    timestamp: '10:00:02'
  },
  {
    id: 'N02',
    title: 'Schema Inspection',
    description: 'Agent inspects the available database schema.',
    status: 'committed',
    parent: 'N01',
    action: 'Inspect database structure',
    timestamp: '10:00:04'
  },
  {
    id: 'N03',
    title: 'Legacy Schema Lookup',
    description: 'Agent attempts to access a deprecated users_v1 table.',
    status: 'failed',
    parent: 'N02',
    action: 'Execute legacy schema lookup',
    timestamp: '10:00:06'
  },
  {
    id: 'N04',
    title: 'Context Rollback',
    description: 'The invalid reasoning branch is isolated and pruned.',
    status: 'pruned',
    parent: 'N03',
    action: 'Remove corrupted context branch',
    timestamp: '10:00:07'
  },
  {
    id: 'N05',
    title: 'Recovery Branch',
    description: 'Agent resumes execution using the verified schema.',
    status: 'recovered',
    parent: 'N02',
    action: 'Restore verified execution state',
    timestamp: '10:00:08'
  },
  {
    id: 'N06',
    title: 'Verified Query',
    description: 'Agent executes the corrected query using users_v2.',
    status: 'recovered',
    parent: 'N05',
    action: 'Execute corrected query',
    timestamp: '10:00:10'
  },
  {
    id: 'N07',
    title: 'Task Completion',
    description: 'The original user objective is completed successfully.',
    status: 'recovered',
    parent: 'N06',
    action: 'Validate final result',
    timestamp: '10:00:12'
  }
];

const statusIcons = {
  committed: CheckCircle2,
  failed: XCircle,
  pruned: AlertTriangle,
  recovered: ShieldCheck,
  pending: Clock
};

export default function CognitiveTree() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selected, setSelected] = useState('ROOT');
  const [zoom, setZoom] = useState(100);
  const [showPruned, setShowPruned] = useState(true);

  const selectedNode = nodes.find(node => node.id === selected);

  const resetTree = () => {
    setNodes(initialNodes);
    setSelected('ROOT');
    setZoom(100);
    setShowPruned(true);
  };

  const simulateRollback = () => {
    setNodes(current =>
      current.map(node => {
        if (node.id === 'N03') {
          return { ...node, status: 'failed' };
        }

        if (node.id === 'N04') {
          return { ...node, status: 'pruned' };
        }

        if (['N05', 'N06', 'N07'].includes(node.id)) {
          return { ...node, status: 'recovered' };
        }

        return node;
      })
    );

    setSelected('N04');
    setShowPruned(true);
  };

  const visibleNodes = nodes.filter(
    node => showPruned || node.status !== 'pruned'
  );

  const statusCounts = {
    committed: nodes.filter(n => n.status === 'committed').length,
    failed: nodes.filter(n => n.status === 'failed').length,
    pruned: nodes.filter(n => n.status === 'pruned').length,
    recovered: nodes.filter(n => n.status === 'recovered').length
  };

  return (
    <div className="cognitive-workspace">

      <div className="cognitive-toolbar">
        <div>
          <div className="eyebrow">MEMORY GOVERNANCE / EXECUTION GRAPH</div>
          <h2>Cognitive State Tree</h2>
          <p>Explore agent reasoning states, execution branches and recovery paths.</p>
        </div>

        <div className="cognitive-actions">
          <button onClick={() => setZoom(z => Math.max(60, z - 10))}>
            <ZoomOut size={16} />
          </button>

          <span>{zoom}%</span>

          <button onClick={() => setZoom(z => Math.min(140, z + 10))}>
            <ZoomIn size={16} />
          </button>

          <button onClick={resetTree}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="cognitive-metrics">
        {Object.entries(statusCounts).map(([status, count]) => {
          const Icon = statusIcons[status as keyof typeof statusIcons];

          return (
            <div className="cognitive-metric" key={status}>
              <Icon size={19} />
              <div>
                <strong>{count}</strong>
                <span>{status.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cognitive-layout">

        <section className="panel cognitive-graph-panel">

          <div className="panel-header">
            <div>
              <h3>Execution graph</h3>
              <p>Selectable cognitive states and branch relationships</p>
            </div>

            <GitBranch size={20} />
          </div>

          <div className="tree-controls">
            <label>
              <input
                type="checkbox"
                checked={showPruned}
                onChange={e => setShowPruned(e.target.checked)}
              />
              Show pruned branches
            </label>

            <button onClick={simulateRollback}>
              <RefreshCw size={15} /> Simulate rollback
            </button>
          </div>

          <div className="cognitive-canvas">
            <div
              className="cognitive-nodes"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {visibleNodes.map(node => {
                const Icon = statusIcons[node.status];

                return (
                  <div
                    key={node.id}
                    className={`cognitive-node ${node.status} ${
                      selected === node.id ? 'selected' : ''
                    }`}
                    onClick={() => setSelected(node.id)}
                  >
                    <div className="cognitive-node-icon">
                      <Icon size={17} />
                    </div>

                    <div className="cognitive-node-info">
                      <small>{node.id}</small>
                      <strong>{node.title}</strong>
                      <span>{node.status.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cognitive-legend">
            <span>● Committed</span>
            <span>● Failed</span>
            <span>● Pruned</span>
            <span>● Recovered</span>
          </div>

        </section>

        <aside className="panel cognitive-inspector">

          <div className="panel-header">
            <div>
              <h3>State inspector</h3>
              <p>Selected execution state</p>
            </div>
            <ShieldCheck size={20} />
          </div>

          {selectedNode && (
            <div className="inspector-content">

              <span className={`inspector-status ${selectedNode.status}`}>
                {selectedNode.status.toUpperCase()}
              </span>

              <h2>{selectedNode.title}</h2>

              <p>{selectedNode.description}</p>

              <div className="inspector-field">
                <span>Node identifier</span>
                <strong>{selectedNode.id}</strong>
              </div>

              <div className="inspector-field">
                <span>Parent node</span>
                <strong>{selectedNode.parent || 'ROOT'}</strong>
              </div>

              <div className="inspector-field">
                <span>Execution action</span>
                <strong>{selectedNode.action}</strong>
              </div>

              <div className="inspector-field">
                <span>Timestamp</span>
                <strong>{selectedNode.timestamp}</strong>
              </div>

              <div className="inspector-note">
                <ShieldCheck size={17} />
                <span>
                  This state belongs to the current simulated execution history.
                </span>
              </div>

            </div>
          )}

        </aside>

      </div>

    </div>
  );
}