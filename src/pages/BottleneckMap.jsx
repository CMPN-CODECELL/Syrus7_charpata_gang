import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  GitFork,
  HeartPulse,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react'

const STAGES = [
  {
    id: 'emergency',
    title: 'Emergency',
    metric: '92% load',
    status: 'Critical',
    statusColor: '#ef4444',
    border: '2px solid #ef4444',
    delayAfter: '+18 min',
    causes: [
      '1. Arrival volume is above the expected baseline.',
      '2. Transfer delays can reduce downstream flow.',
      '3. Suitable bed availability may be limited.',
    ],
    effects: [
      { name: 'Ward admission', val: '+11 min' },
      { name: 'Emergency boarding', val: '+8 patients' },
    ],
    prevention: 'Review transfer coordination and bed status.',
  },
  {
    id: 'radiology',
    title: 'Lab / Radiology',
    metric: '22 queued',
    status: 'High risk',
    statusColor: '#f97316',
    border: '2px solid #f97316',
    delayAfter: '+11 min',
    causes: [
      '1. CT Scanner 2 experiencing offline maintenance.',
      '2. Stat emergency labs prioritizing over routine draws.',
      '3. Technician shift transition deficit.',
    ],
    effects: [
      { name: 'Emergency disposition', val: '+24 min' },
      { name: 'Observation holding', val: '+4 patients' },
    ],
    prevention: 'Re-route non-urgent outpatients to evening imaging.',
  },
  {
    id: 'ward',
    title: 'Ward admission',
    metric: '14 waiting',
    status: 'Warning',
    statusColor: '#eab308',
    border: '2px solid #eab308',
    delayAfter: null,
    causes: [
      '1. Delayed discharge summaries from morning rounds.',
      '2. Bed turnover sanitization lagging peak demand.',
    ],
    effects: [
      { name: 'ED boarding hold', val: '+35 min' },
    ],
    prevention: 'Expedite discharge lounge transition for cleared patients.',
  },
  {
    id: 'beds',
    title: 'Bed availability',
    metric: '47 open',
    status: 'Warning',
    statusColor: '#eab308',
    border: '2px solid #eab308',
    delayAfter: null,
    causes: [
      '1. Specialized telemetry monitor allocation constrained.',
    ],
    effects: [
      { name: 'ICU step-down delay', val: '+14 min' },
    ],
    prevention: 'Activate flex-bed protocol in East Wing.',
  },
]

export default function BottleneckMap() {
  const [selectedStage, setSelectedStage] = useState(STAGES[0])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Title */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>PATIENT FLOW INTELLIGENCE</span>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
          Bottleneck cascade map[cite: 8]
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Trace how operational constraints can propagate through patient flow.[cite: 8]
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        {/* Left Column: Horizontal Flow Progression */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>Patient flow forecast[cite: 8]</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Select a stage to inspect possible causes and downstream effects.[cite: 8]</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626' }}>
                1 critical path · demo[cite: 8]
              </span>
            </div>

            {/* Horizontal Stage Progression */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', padding: '16px 0 24px 0' }}>
              {STAGES.map((stage) => {
                const isSelected = selectedStage.id === stage.id

                return (
                  <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {/* Stage Card */}
                    <div
                      onClick={() => setSelectedStage(stage)}
                      style={{
                        background: '#ffffff',
                        border: stage.border,
                        outline: isSelected ? '3px solid #0d9488' : 'none',
                        borderRadius: '12px',
                        padding: '16px',
                        width: '140px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        <Zap size={18} color={stage.statusColor} />
                      </div>
                      <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>{stage.title}[cite: 8]</strong>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '4px 0 8px 0' }}>{stage.metric}[cite: 8]</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: stage.status === 'Critical' ? '#fee2e2' : stage.status === 'High risk' ? '#ffedd5' : '#fef9c3',
                          color: stage.statusColor,
                        }}
                      >
                        {stage.status}[cite: 8]
                      </span>
                    </div>

                    {/* Delay Arrow Connector */}
                    {stage.delayAfter && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <ArrowRight size={16} color="#94a3b8" />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}>{stage.delayAfter}[cite: 8]</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '11px', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Critical[cite: 8]
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }} /> High risk[cite: 8]
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} /> Warning[cite: 8]
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Stable[cite: 8]
            </span>
          </div>
        </div>

        {/* Right Column: Selected Stage Analysis */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>{selectedStage.title}[cite: 8]</h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Selected stage analysis[cite: 8]</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: selectedStage.statusColor }}>{selectedStage.status}[cite: 8]</span>
            </div>

            {/* Why this may be happening */}
            <div style={{ marginTop: '16px' }}>
              <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Why this may be happening[cite: 8]
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
                {selectedStage.causes.map(c => (
                  <div key={c}>{c}[cite: 8]</div>
                ))}
              </div>
            </div>

            {/* Possible downstream effects */}
            <div style={{ marginTop: '20px' }}>
              <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Possible downstream effects[cite: 8]
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedStage.effects.map(eff => (
                  <div key={eff.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155' }}>
                    <span>{eff.name}[cite: 8]</span>
                    <strong style={{ color: '#ef4444' }}>{eff.val}[cite: 8]</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested prevention card */}
          <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '14px', borderRadius: '8px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', marginBottom: '4px' }}>
              <Sparkles size={14} />
              <strong style={{ fontSize: '11px' }}>Suggested prevention[cite: 8]</strong>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#115e59', lineHeight: 1.4 }}>
              {selectedStage.prevention}[cite: 8]
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}