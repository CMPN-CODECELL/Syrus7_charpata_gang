import {
  Activity,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Leaf,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react'

export default function Sustainability() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner: POC Domain & Problem Statement */}
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
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#047857',
              color: '#ffffff',
              letterSpacing: '1px',
            }}
          >
            HACKATHON TRACK: SUSTAINABILITY - HEALTHCARE
          </span>
          <h2 style={{ fontSize: '18px', color: '#0f172a', margin: '6px 0 2px 0' }}>
            FlowGuard AI: SDG 3 & SDG 9 Impact Radar
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            PS1 - Predictive Hospital Bottleneck Intelligence: Resilient hospital systems through proactive capacity management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, padding: '6px 12px', borderRadius: '6px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
            SDG 3.8 & 3.d
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, padding: '6px 12px', borderRadius: '6px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
            SDG 9.1
          </span>
        </div>
      </div>

      {/* Grid 1: Exact POC SDG Alignments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* SDG 3 Box */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #a7f3d0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>SDG 3: Good Health and Well-being</strong>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Targets 3.8 & 3.d</div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
            "Faster care access and early warning of health risks." FlowGuard AI enables hospital coordinators to eliminate acute bottleneck queues before delays cascade to intensive care and triage.
          </p>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#334155' }}>
            <div style={{ marginBottom: '6px' }}>
              <strong>Target 3.8:</strong> Achieve universal health coverage and access to quality essential healthcare services without emergency gridlock delays.
            </div>
            <div>
              <strong>Target 3.d:</strong> Strengthen the capacity of national health systems for early warning, risk reduction, and management of seasonal disease surges (flu, monsoon, dengue).
            </div>
          </div>
        </div>

        {/* SDG 9 Box */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #bfdbfe',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>SDG 9: Industry, Innovation & Infrastructure</strong>
              <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>Target 9.1</div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
            "Resilient, data-driven hospital infrastructure." Moving from reactive bottleneck responses to continuous, automated decision support protects healthcare infrastructure from burnout and failure.
          </p>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#334155' }}>
            <div style={{ marginBottom: '6px' }}>
              <strong>Target 9.1:</strong> Develop quality, reliable, sustainable, and resilient regional healthcare infrastructure to support operational continuity during mass surges.
            </div>
            <div>
              <strong>Asset Preservation:</strong> Diagnostic imaging equipment (CT/MRI) operates under planned maintenance curves rather than emergency redline fatigue.
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Resource Sustainability Metrics */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ fontSize: '14px', margin: '0 0 14px 0', color: '#0f172a' }}>
          Sustainable Operations KPI Impact
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Avoided Critical Care Delays</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f766e', margin: '4px 0' }}>-3.8 hrs</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Average reduction in emergency boarding times</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Diagnostic Equipment Life Extension</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>+22%</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Reduction in uncoordinated emergency scans</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Inpatient Bed Turnover Velocity</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>1.14x</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Midday discharge coordination efficiency</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Ambulance Diversions Prevented</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', margin: '4px 0' }}>Zero Diverts</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Maintained continuous emergency intake</span>
          </div>
        </div>
      </div>
    </div>
  )
}