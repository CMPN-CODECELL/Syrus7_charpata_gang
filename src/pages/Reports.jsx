import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
} from 'lucide-react'

const WAIT_TIMES = [
  { dept: 'Emergency', time: '38m', pct: 65 },
  { dept: 'Radiology', time: '54m', pct: 92 },
  { dept: 'Laboratory', time: '31m', pct: 52 },
  { dept: 'Pharmacy', time: '16m', pct: 28 },
  { dept: 'Discharge', time: '42m', pct: 72 },
]

const INTERVENTIONS = [
  {
    intervention: 'Flex-bed activation (Ward B)',
    department: 'Emergency',
    expected: '-25m boarding time',
    observed: '-18m reduction',
    outcome: 'Effective',
  },
  {
    intervention: 'Outpatient scan slot reschedule',
    department: 'Radiology',
    expected: '-15 scans in peak backlog',
    observed: '-14 scans diverted',
    outcome: 'Effective',
  },
  {
    intervention: 'Expedited discharge round',
    department: 'Discharge',
    expected: '+8 beds freed before 2 PM',
    observed: '+6 beds freed',
    outcome: 'Partial target',
  },
  {
    intervention: 'Pharmacy evening runner shift',
    department: 'Pharmacy',
    expected: '-10m medication turnaround',
    observed: '-11m turnaround',
    outcome: 'Effective',
  },
]

export default function Reports() {
  const [timeframe, setTimeframe] = useState('Weekly')

  function handleExportCSV() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Department,Wait Time,Utilization\n' +
      WAIT_TIMES.map(w => `${w.dept},${w.time},${w.pct}%`).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `FlowGuard_${timeframe}_Performance.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header and Export Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>PERFORMANCE</span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
            Reports & analytics
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Understand flow performance, forecast assumptions, and intervention outcomes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} />
            <span>↓ CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: '#0d9488',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={14} />
            <span>↓ Export report</span>
          </button>
        </div>
      </div>

      {/* Period Toggle */}
      <div style={{ display: 'flex', background: '#e2e8f0', padding: '3px', borderRadius: '8px', width: 'fit-content' }}>
        {['Daily', 'Weekly', 'Monthly'].map(period => (
          <button
            key={period}
            type="button"
            onClick={() => setTimeframe(period)}
            style={{
              background: timeframe === period ? '#ffffff' : 'transparent',
              color: timeframe === period ? '#0f172a' : '#64748b',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: timeframe === period ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {period}
          </button>
        ))}
      </div>

      {/* 4 Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Avg. waiting time</span>
          <strong style={{ fontSize: '26px', color: '#0f172a', display: 'block', margin: '4px 0' }}>31m</strong>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowDown size={12} /> 8% vs prior
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Capacity utilization</span>
          <strong style={{ fontSize: '26px', color: '#0f172a', display: 'block', margin: '4px 0' }}>78.4%</strong>
          <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUp size={12} /> 2.1%
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Forecast accuracy</span>
          <strong style={{ fontSize: '24px', color: '#0f172a', display: 'block', margin: '4px 0' }}>Demo only</strong>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Not validated</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Actions reviewed</span>
          <strong style={{ fontSize: '26px', color: '#0f172a', display: 'block', margin: '4px 0' }}>0</strong>
          <span style={{ fontSize: '11px', color: '#64748b' }}>In this session</span>
        </div>
      </div>

      {/* Middle Row: Waiting Time by Dept + Forecast Interpretation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        {/* Waiting Time by Dept */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
              Waiting time by department
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Illustrative median in minutes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {WAIT_TIMES.map(w => (
              <div key={w.dept} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 45px', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{w.dept}</span>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${w.pct}%`, height: '100%', background: '#0d9488', borderRadius: '999px' }} />
                </div>
                <strong style={{ fontSize: '12px', color: '#0f172a', textAlign: 'right' }}>{w.time}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Interpretation Card */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Forecast interpretation</span>
          <strong style={{ fontSize: '28px', color: '#0d9488', fontWeight: 900, margin: '8px 0 12px 0' }}>
            Prototype
          </strong>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
            Do not present synthetic values as real-world forecast accuracy or measured clinical outcomes.
          </p>
        </div>
      </div>

      {/* Bottom Table: Intervention Outcomes */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
            Intervention outcomes
          </h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Example actions and hypothetical impact</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
              <th style={{ padding: '12px 16px' }}>INTERVENTION</th>
              <th style={{ padding: '12px 16px' }}>DEPARTMENT</th>
              <th style={{ padding: '12px 16px' }}>EXPECTED</th>
              <th style={{ padding: '12px 16px' }}>OBSERVED</th>
              <th style={{ padding: '12px 16px' }}>OUTCOME</th>
            </tr>
          </thead>
          <tbody>
            {INTERVENTIONS.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{row.intervention}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{row.department}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.expected}</td>
                <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>{row.observed}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#059669' }}>
                    {row.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}