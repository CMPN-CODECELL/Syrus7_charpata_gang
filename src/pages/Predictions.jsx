import {
  Activity,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts'

const TRAJECTORY_DATA = [
  { time: 'Now', workload: 70, capacity: 76 },
  { time: '2 PM', workload: 75, capacity: 77 },
  { time: '4 PM', workload: 82, capacity: 79 },
  { time: '6 PM', workload: 97, capacity: 80 },
  { time: '8 PM', workload: 104, capacity: 81 },
  { time: '10 PM', workload: 114, capacity: 83 },
  { time: '12 AM', workload: 108, capacity: 84 },
]

export default function Predictions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>FORECAST WORKSPACE</span>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>Predictions</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Illustrative demand and capacity projection for the next 12 hours.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Peak emergency load</span>
          <strong style={{ fontSize: '32px', color: '#0f172a', display: 'block', margin: '6px 0 8px 0' }}>114%</strong>
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#fee2e2', color: '#dc2626' }}>
            Capacity pressure
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Median wait estimate</span>
          <strong style={{ fontSize: '32px', color: '#0f172a', display: 'block', margin: '6px 0 8px 0' }}>67m</strong>
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309' }}>
            Scenario estimate
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Departments at risk</span>
          <strong style={{ fontSize: '32px', color: '#0f172a', display: 'block', margin: '6px 0 8px 0' }}>5</strong>
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309' }}>
            Monitor closely
          </span>
        </div>
      </div>

      {/* Main Trajectory Chart */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
              Projected workload trajectory
            </h2>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Scenario curve versus nominal capacity</span>
          </div>

          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb' }}>
            Synthetic forecast
          </span>
        </div>

        <div style={{ height: '360px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TRAJECTORY_DATA} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[65, 120]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />

              {/* Workload Trajectory Curve (Teal Solid) */}
              <Line
                type="monotone"
                dataKey="workload"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0d9488' }}
                name="Estimated Workload"
              />

              {/* Nominal Capacity Curve (Dashed Mustard) */}
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Nominal Capacity"
              />

              {/* 4 PM Intersection Marker */}
              <ReferenceDot x="4 PM" y={82} r={5} fill="#0f172a" stroke="#ffffff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          {/* Screenshot Tooltip Badge at 4 PM */}
          <div
            style={{
              position: 'absolute',
              top: '190px',
              left: '42%',
              background: '#0f172a',
              color: '#ffffff',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 700,
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
            }}
          >
            <div>4 PM</div>
            <div style={{ color: '#2dd4bf' }}>■ Estimated workload: 82</div>
            <div style={{ color: '#fbbf24' }}>■ Nominal capacity: 79</div>
          </div>
        </div>
      </div>
    </div>
  )
}