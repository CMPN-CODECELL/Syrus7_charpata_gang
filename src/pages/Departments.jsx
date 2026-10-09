import { useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Table as TableIcon,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

const DEPARTMENTS_DATA = [
  {
    id: 'emergency',
    name: 'Emergency',
    status: 'Critical',
    workloadPct: 92,
    queue: 34,
    wait: '38m',
    staff: '18/21',
    predictedBottleneck: '16:30',
    color: '#ef4444',
  },
  {
    id: 'radiology',
    name: 'Radiology',
    status: 'High Risk',
    workloadPct: 87,
    queue: 22,
    wait: '54m',
    staff: '8/10',
    predictedBottleneck: '18:10',
    color: '#f97316',
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    status: 'Warning',
    workloadPct: 76,
    queue: 38,
    wait: '31m',
    staff: '12/14',
    predictedBottleneck: '21:20',
    color: '#eab308',
  },
  {
    id: 'icu',
    name: 'ICU',
    status: 'Stable',
    workloadPct: 68,
    queue: 3,
    wait: '12m',
    staff: '16/18',
    predictedBottleneck: '—',
    color: '#10b981',
  },
  {
    id: 'ward',
    name: 'General Ward',
    status: 'Warning',
    workloadPct: 82,
    queue: 14,
    wait: '27m',
    staff: '34/39',
    predictedBottleneck: '22:40',
    color: '#eab308',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    status: 'Stable',
    workloadPct: 61,
    queue: 17,
    wait: '16m',
    staff: '9/11',
    predictedBottleneck: '—',
    color: '#10b981',
  },
  {
    id: 'discharge',
    name: 'Discharge',
    status: 'Warning',
    workloadPct: 74,
    queue: 26,
    wait: '42m',
    staff: '7/9',
    predictedBottleneck: '20:15',
    color: '#eab308',
  },
]

const PROJECTION_HOURS = [
  { time: 'Now', workload: 72, nominal: 80 },
  { time: '2 PM', workload: 75, nominal: 80 },
  { time: '4 PM', workload: 82, nominal: 80 },
  { time: '6 PM', workload: 97, nominal: 80 },
  { time: '8 PM', workload: 104, nominal: 80 },
  { time: '10 PM', workload: 114, nominal: 80 },
  { time: '12 AM', workload: 108, nominal: 80 },
]

export default function Departments() {
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title & View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>OPERATIONS</span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
            Department monitoring
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Read-only operational health across connected departments.
          </p>
        </div>

        {/* Cards vs Table Toggle */}
        <div style={{ display: 'flex', background: '#0f172a', padding: '3px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            style={{
              background: viewMode === 'cards' ? '#1e293b' : 'transparent',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              background: viewMode === 'table' ? '#1e293b' : 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Table
          </button>
        </div>
      </div>

      {/* View Mode: Cards Layout */}
      {viewMode === 'cards' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '16px',
          }}
        >
          {DEPARTMENTS_DATA.map(dept => {
            const isCritical = dept.status === 'Critical'
            const isHighRisk = dept.status === 'High Risk'
            const isWarning = dept.status === 'Warning'

            const statusBg = isCritical ? '#fef2f2' : isHighRisk ? '#fff7ed' : isWarning ? '#fefce8' : '#ecfdf5'
            const statusColor = isCritical ? '#dc2626' : isHighRisk ? '#ea580c' : isWarning ? '#ca8a04' : '#059669'

            return (
              <div
                key={dept.id}
                style={{
                  background: '#ffffff',
                  border: isCritical ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: dept.color,
                        }}
                      />
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{dept.name}</strong>
                    </div>

                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: statusBg,
                        color: statusColor,
                      }}
                    >
                      {dept.status}
                    </span>
                  </div>

                  {/* Workload vs Capacity Progress Bar */}
                  <div style={{ margin: '14px 0 16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                      <span>Workload vs capacity</span>
                      <strong style={{ color: '#0f172a' }}>{dept.workloadPct}%</strong>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${dept.workloadPct}%`,
                          height: '100%',
                          background: dept.workloadPct >= 90 ? '#ef4444' : dept.workloadPct >= 80 ? '#0d9488' : '#0f766e',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>

                  {/* 3 Metric Columns: Queue, Wait, Staff */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderTop: '1px solid #f8fafc', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Queue</span>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{dept.queue}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Wait</span>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{dept.wait}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Staff</span>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{dept.staff}</strong>
                    </div>
                  </div>
                </div>

                {/* Predicted Bottleneck Footer */}
                <div
                  style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                    marginTop: '14px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#64748b' }}>Predicted bottleneck</span>
                  <strong style={{ color: dept.predictedBottleneck !== '—' ? '#0f172a' : '#94a3b8' }}>
                    {dept.predictedBottleneck}
                  </strong>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* View Mode: Table Layout */
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                <th style={{ padding: '12px 16px' }}>DEPARTMENT</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>WORKLOAD</th>
                <th style={{ padding: '12px 16px' }}>QUEUE</th>
                <th style={{ padding: '12px 16px' }}>WAIT</th>
                <th style={{ padding: '12px 16px' }}>STAFF</th>
                <th style={{ padding: '12px 16px' }}>BOTTLENECK TIME</th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENTS_DATA.map(dept => (
                <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{dept.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: dept.workloadPct >= 85 ? '#fee2e2' : '#f1f5f9', color: dept.color }}>
                      {dept.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{dept.workloadPct}%</td>
                  <td style={{ padding: '12px 16px' }}>{dept.queue}</td>
                  <td style={{ padding: '12px 16px' }}>{dept.wait}</td>
                  <td style={{ padding: '12px 16px' }}>{dept.staff}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{dept.predictedBottleneck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Emergency Forecast Detail Section */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Emergency forecast detail
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>12-hour workload projection versus rated capacity.</span>
        </div>

        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PROJECTION_HOURS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="emergencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 125]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <ReferenceLine y={80} stroke="#ca8a04" strokeDasharray="4 4" label={{ value: 'Nominal Capacity: 80%', fill: '#ca8a04', fontSize: 10 }} />
              <Area type="monotone" dataKey="workload" stroke="#0d9488" strokeWidth={3} fill="url(#emergencyGradient)" name="Projected Load %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}