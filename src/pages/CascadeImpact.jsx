import { useState, useMemo } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  Layers,
  Network,
  RefreshCw,
  ShieldAlert,
  Zap,
} from 'lucide-react'

// Topology layout of connected hospital departments (SVG coordinate space: 800 x 380)
const BASE_NODES = [
  { id: 'ed', name: 'Emergency Care', short: 'ED', x: 100, y: 190, baselineRisk: 32, type: 'intake' },
  { id: 'rad', name: 'Radiology / CT', short: 'RAD', x: 290, y: 95, baselineRisk: 42, type: 'diagnostic' },
  { id: 'path', name: 'Pathology Lab', short: 'LAB', x: 290, y: 285, baselineRisk: 28, type: 'diagnostic' },
  { id: 'surg', name: 'Operating Theatres', short: 'OR', x: 490, y: 95, baselineRisk: 35, type: 'clinical' },
  { id: 'icu', name: 'Intensive Care (ICU)', short: 'ICU', x: 490, y: 285, baselineRisk: 48, type: 'critical' },
  { id: 'ward', name: 'Inpatient Wards', short: 'WARD', x: 690, y: 140, baselineRisk: 38, type: 'bed' },
  { id: 'pharm', name: 'Pharmacy & Discharge', short: 'PHARM', x: 690, y: 260, baselineRisk: 25, type: 'discharge' },
]

// Directed clinical workflow edges: from -> to with transmission coefficients
const WORKFLOW_EDGES = [
  { from: 'ed', to: 'rad', label: 'Imaging orders', weight: 0.85 },
  { from: 'ed', to: 'path', label: 'Stat blood panels', weight: 0.70 },
  { from: 'rad', to: 'surg', label: 'Trauma scans', weight: 0.65 },
  { from: 'rad', to: 'icu', label: 'Critical diagnoses', weight: 0.75 },
  { from: 'path', to: 'icu', label: 'Sepsis / Lab alerts', weight: 0.60 },
  { from: 'surg', to: 'icu', label: 'Post-op recovery', weight: 0.80 },
  { from: 'surg', to: 'ward', label: 'Surgical recovery', weight: 0.70 },
  { from: 'icu', to: 'ward', label: 'Step-down transfers', weight: 0.75 },
  { from: 'ward', to: 'pharm', label: 'Discharge meds', weight: 0.55 },
]

// Shock scenarios
const SHOCK_PRESETS = {
  'ed-surge': {
    originId: 'ed',
    title: 'Emergency Arrival Surge (+45% intake)',
    severity: 'High',
    description: 'Mass-casualty or respiratory season influx overflowing the triage and emergency bays.',
    propagation: [
      { step: 1, time: 'T + 0.0h', dept: 'Emergency Care', impact: 'Primary queue saturation (+18 patients). Triage wait time doubles.' },
      { step: 2, time: 'T + 1.5h', dept: 'Radiology / CT', impact: 'Stat imaging requests surge by 65%. Scanner queue reaches critical backlog.' },
      { step: 3, time: 'T + 3.0h', dept: 'Intensive Care (ICU)', impact: 'High-acuity admissions from ED stall due to lack of available monitored beds.' },
      { step: 4, time: 'T + 5.0h', dept: 'Inpatient Wards', impact: 'Boarding delay in ED as general wards delay discharges, blocking bed turnover.' },
    ],
    recommendedMitigations: [
      'Activate ED fast-track lane for minor ambulatory cases (ESI-4/5).',
      'Postpone elective out-patient CT scans to preserve imaging capacity for ED trauma cases.',
      'Authorize rapid floor bed turnover: instruct ward charge nurses to expedite discharges by 11:00 AM.',
    ],
  },
  'rad-outage': {
    originId: 'rad',
    title: 'CT Scanner 01 Unscheduled Downtime',
    severity: 'Critical',
    description: 'Hardware failure takes primary emergency CT scanner offline during peak shift.',
    propagation: [
      { step: 1, time: 'T + 0.0h', dept: 'Radiology / CT', impact: 'Capacity halved. Imaging turnaround jumps from 28 mins to 75 mins.' },
      { step: 2, time: 'T + 1.2h', dept: 'Emergency Care', impact: 'Trauma patients cannot be disposed or admitted without scans; ED bays gridlocked.' },
      { step: 3, time: 'T + 2.5h', dept: 'Operating Theatres', impact: 'Emergency surgical consults delayed waiting for diagnostic confirmation.' },
      { step: 4, time: 'T + 4.0h', dept: 'Hospital-Wide', impact: 'Ambulance diversion advisory triggered due to prolonged ED turnaround.' },
    ],
    recommendedMitigations: [
      'Reroute emergency diagnostic scans to Inpatient CT Scanner 02 immediately.',
      'Notify regional emergency dispatch of potential 30-minute triage delay for non-critical trauma.',
      'Dispatch on-call biomedical engineering technician under priority maintenance protocol.',
    ],
  },
  'icu-saturation': {
    originId: 'icu',
    title: 'ICU Bed Saturation (100% Occupancy)',
    severity: 'Critical',
    description: 'All 20 intensive care beds occupied with prolonged mechanical ventilation stays.',
    propagation: [
      { step: 1, time: 'T + 0.0h', dept: 'Intensive Care (ICU)', impact: 'Zero critical beds available. Staff-to-patient ratio exceeds safe threshold.' },
      { step: 2, time: 'T + 1.0h', dept: 'Operating Theatres', impact: 'Major elective surgeries placed on hold due to missing guaranteed post-op ICU bed.' },
      { step: 3, time: 'T + 2.0h', dept: 'Emergency Care', impact: 'Severe resuscitation cases held in ED bay (boarding), tying down 2 dedicated nurses.' },
      { step: 4, time: 'T + 4.5h', dept: 'Inpatient Wards', impact: 'Step-down transfer candidates accelerated to open ICU beds prematurely.' },
    ],
    recommendedMitigations: [
      'Conduct emergency clinical review of current ICU cohort for step-down transition to Ward.',
      'Convert PACU (Post-Anesthesia Care Unit) beds into temporary high-dependency overflow units.',
      'Pause non-urgent elective cardiac and neurosurgical procedures requiring mandatory ICU monitoring.',
    ],
  },
}

export default function CascadeImpact() {
  const [activeScenarioKey, setActiveScenarioKey] = useState('ed-surge')
  const [selectedNodeId, setSelectedNodeId] = useState('rad')
  const [shockMagnitude, setShockMagnitude] = useState(1.0) // 1.0 = standard, 1.4 = extreme

  const currentScenario = SHOCK_PRESETS[activeScenarioKey]

  // Calculate dynamic cascade risk for each node deterministically
  const computedNodes = useMemo(() => {
    return BASE_NODES.map(node => {
      let riskDelta = 0

      if (node.id === currentScenario.originId) {
        riskDelta = 55 * shockMagnitude
      } else if (activeScenarioKey === 'ed-surge') {
        if (node.id === 'rad') riskDelta = 42 * shockMagnitude
        if (node.id === 'path') riskDelta = 28 * shockMagnitude
        if (node.id === 'icu') riskDelta = 34 * shockMagnitude
        if (node.id === 'surg') riskDelta = 22 * shockMagnitude
        if (node.id === 'ward') riskDelta = 30 * shockMagnitude
        if (node.id === 'pharm') riskDelta = 18 * shockMagnitude
      } else if (activeScenarioKey === 'rad-outage') {
        if (node.id === 'ed') riskDelta = 48 * shockMagnitude
        if (node.id === 'surg') riskDelta = 38 * shockMagnitude
        if (node.id === 'icu') riskDelta = 26 * shockMagnitude
        if (node.id === 'ward') riskDelta = 14 * shockMagnitude
      } else if (activeScenarioKey === 'icu-saturation') {
        if (node.id === 'surg') riskDelta = 46 * shockMagnitude
        if (node.id === 'ed') riskDelta = 40 * shockMagnitude
        if (node.id === 'ward') riskDelta = 35 * shockMagnitude
      }

      const totalRisk = Math.min(99, Math.round(node.baselineRisk + riskDelta))
      const isCritical = totalRisk >= 80
      const isWarning = totalRisk >= 60

      return {
        ...node,
        risk: totalRisk,
        riskDelta: Math.round(riskDelta),
        status: isCritical ? 'critical' : isWarning ? 'warning' : 'optimal',
        isOrigin: node.id === currentScenario.originId,
      }
    })
  }, [activeScenarioKey, shockMagnitude, currentScenario.originId])

  const selectedNode = computedNodes.find(n => n.id === selectedNodeId) || computedNodes[0]

  // Cumulative hospital delay calculation
  const totalDelayHours = useMemo(() => {
    const rawSum = computedNodes.reduce((acc, n) => acc + (n.riskDelta * 0.08), 0)
    return (rawSum * shockMagnitude).toFixed(1)
  }, [computedNodes, shockMagnitude])

  const impactedCount = computedNodes.filter(n => n.riskDelta > 15).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner: Scenario Controls */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <Network size={13} />
              PROPAGATION ENGINE
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Simulates downstream ripple effects across connected clinical units
            </span>
          </div>
          <h2 style={{ fontSize: '18px', color: '#0f172a', margin: '6px 0 2px 0' }}>
            {currentScenario.title}
          </h2>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
            {currentScenario.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>TRIGGER SHOCK:</span>
          {Object.entries(SHOCK_PRESETS).map(([key, sc]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveScenarioKey(key)
                setSelectedNodeId(sc.originId)
              }}
              style={{
                border: '1px solid',
                borderColor: activeScenarioKey === key ? '#0f766e' : '#cbd5e1',
                background: activeScenarioKey === key ? '#0f766e' : '#ffffff',
                color: activeScenarioKey === key ? '#ffffff' : '#334155',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {key === 'ed-surge' ? 'ED Influx Surge' : key === 'rad-outage' ? 'CT Scanner Down' : 'ICU Saturated'}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShockMagnitude(prev => (prev === 1.0 ? 1.4 : 1.0))}
            style={{
              border: '1px solid',
              borderColor: shockMagnitude > 1.0 ? '#dc2626' : '#cbd5e1',
              background: shockMagnitude > 1.0 ? '#fef2f2' : '#ffffff',
              color: shockMagnitude > 1.0 ? '#dc2626' : '#475569',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {shockMagnitude > 1.0 ? 'Extreme Shock (1.4x)' : 'Standard Shock (1.0x)'}
          </button>
        </div>
      </div>

      {/* KPI Cards: Cascade Impact Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Cumulative Wait Time Added</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            +{totalDelayHours} hrs
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Aggregate patient transit delay hospital-wide</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Downstream Departments Affected</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {impactedCount} of {BASE_NODES.length} Units
          </div>
          <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 600 }}>Cross-unit risk transmission active</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Highest Downstream Casualty</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f766e', margin: '4px 0' }}>
            {computedNodes.filter(n => !n.isOrigin).reduce((max, n) => (n.risk > max.risk ? n : max)).name}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Highest secondary risk score</span>
        </div>
      </div>

      {/* Main Interactive Visual Dependency Network (SVG) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>
              Hospital Dependency Topology & Risk Transmission Graph
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Arrows indicate patient and order flows. Click any node to inspect transmission dynamics.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} /> Critical (≥80%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c' }} /> Warning (≥60%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} /> Optimal
            </span>
          </div>
        </div>

        {/* SVG Graph Viewport */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox="0 0 800 380"
            style={{
              width: '100%',
              minWidth: '720px',
              height: '340px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
              </marker>
              <marker
                id="arrow-hot"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* Directed Workflow Edges */}
            {WORKFLOW_EDGES.map((edge, idx) => {
              const sourceNode = computedNodes.find(n => n.id === edge.from)
              const targetNode = computedNodes.find(n => n.id === edge.to)
              if (!sourceNode || !targetNode) return null

              const isHot = sourceNode.risk >= 60 && targetNode.risk >= 60

              return (
                <g key={idx}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHot ? '#dc2626' : '#cbd5e1'}
                    strokeWidth={isHot ? 2.5 : 1.5}
                    strokeDasharray={isHot ? '5,4' : 'none'}
                    markerEnd={isHot ? 'url(#arrow-hot)' : 'url(#arrow)'}
                  />
                  {/* Midpoint transmission label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 6}
                    fill={isHot ? '#b91c1c' : '#64748b'}
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight={isHot ? 700 : 500}
                  >
                    {edge.label}
                  </text>
                </g>
              )
            })}

            {/* Department Nodes */}
            {computedNodes.map(node => {
              const isSelected = node.id === selectedNodeId
              const nodeColor =
                node.status === 'critical' ? '#dc2626' : node.status === 'warning' ? '#ea580c' : '#16a34a'
              const nodeBg =
                node.status === 'critical' ? '#fef2f2' : node.status === 'warning' ? '#fff7ed' : '#f0fdf4'

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Origin pulse circle */}
                  {node.isOrigin && (
                    <circle
                      r="40"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  )}

                  {/* Main Node Card */}
                  <rect
                    x="-55"
                    y="-30"
                    width="110"
                    height="60"
                    rx="10"
                    fill={nodeBg}
                    stroke={isSelected ? '#0f766e' : nodeColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />

                  {/* Node Title */}
                  <text
                    y="-10"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {node.name.length > 13 ? `${node.name.slice(0, 11)}..` : node.name}
                  </text>

                  {/* Risk Badge */}
                  <rect
                    x="-35"
                    y="4"
                    width="70"
                    height="18"
                    rx="4"
                    fill={nodeColor}
                  />
                  <text
                    y="16"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="800"
                  >
                    {node.risk}% RISK
                  </text>

                  {node.isOrigin && (
                    <text
                      y="-35"
                      textAnchor="middle"
                      fill="#dc2626"
                      fontSize="9"
                      fontWeight="800"
                    >
                      EPICENTER
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Lower Row: Propagation Sequence Timeline & Selected Node Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '16px',
        }}
      >
        {/* Cascade Chronology Timeline */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={16} color="#0f766e" />
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>
              Cascade Transmission Chronology
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentScenario.propagation.map(item => (
              <div
                key={item.step}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '12px',
                  borderRadius: '8px',
                  background: item.step === 1 ? '#fef2f2' : '#f8fafc',
                  border: `1px solid ${item.step === 1 ? '#fecaca' : '#e2e8f0'}`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: item.step === 1 ? '#dc2626' : '#0f766e',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.dept}</strong>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{item.time}</span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    {item.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Root-Cause & Action Breakdown */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#0f766e' }}>
              UNIT CASUALTY ANALYSIS
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>{selectedNode.name}</h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: selectedNode.status === 'critical' ? '#fef2f2' : selectedNode.status === 'warning' ? '#fff7ed' : '#f0fdf4',
                  color: selectedNode.status === 'critical' ? '#dc2626' : selectedNode.status === 'warning' ? '#ea580c' : '#16a34a',
                }}
              >
                {selectedNode.risk}% RISK {selectedNode.isOrigin && '(SHOCK EPICENTER)'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Baseline Risk</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedNode.baselineRisk}%</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Shock Transmission</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: selectedNode.riskDelta > 0 ? '#dc2626' : '#0f766e' }}>
                  +{selectedNode.riskDelta}%
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '12px', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} color="#0f766e" /> Human Intervention: Break the Cascade Chain
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
              {currentScenario.recommendedMitigations.map((action, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{action}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            Illustrative operational transmission modeling. Final workflow diversions must be authorized by hospital clinical command.
          </div>
        </div>
      </div>
    </div>
  )
}