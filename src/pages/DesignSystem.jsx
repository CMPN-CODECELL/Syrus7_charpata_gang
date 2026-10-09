import { Check, Info, ShieldCheck } from 'lucide-react'

export default function DesignSystem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>CARE PULSE AI</span>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>Design system</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Reusable foundations for a consistent, accessible operations experience.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Color & Status */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '16px' }}>Color & status</strong>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#0d1f2d', border: '1px solid #0d1f2d' }} />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>Navy</span>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#0d9488', border: '1px solid #0d9488' }} />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>Teal</span>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#dc2626', border: '1px solid #dc2626' }} />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>Critical</span>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#d97706', border: '1px solid #d97706' }} />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>Warning</span>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1' }} />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>Surface</span>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '12px' }}>Typography</strong>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Display heading</h2>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Section heading</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
            Body text communicates operational context clearly.
          </p>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0d9488', letterSpacing: '0.8px' }}>
            LABEL · SUPPORTING TEXT
          </span>
        </div>

        {/* Status Indicators */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '16px' }}>Status indicators</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626' }}>Critical</span>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#ffedd5', color: '#ea580c' }}>High Risk</span>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#fef3c7', color: '#b45309' }}>Warning</span>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#ecfdf5', color: '#059669' }}>Stable</span>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb' }}>Demo estimate</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '16px' }}>Controls</strong>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              style={{ background: '#0d9488', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Primary action
            </button>
            <button
              type="button"
              style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}