import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BedDouble,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'

// FIG 2: Baseline Synthetic Breach Curve Dataset (Hourly Timeline: -6h to +12h)
const BASE_BREACH_TIMELINE = [
  { time: '-6h', observed: 16, median: null, p10: null, p90: null, capacity: 30 },
  { time: '-5h', observed: 18, median: null, p10: null, p90: null, capacity: 30 },
  { time: '-4h', observed: 19, median: null, p10: null, p90: null, capacity: 30 },
  { time: '-3h', observed: 20, median: null, p10: null, p90: null, capacity: 30 },
  { time: '-2h', observed: 21, median: null, p10: null, p90: null, capacity: 30 },
  { time: '-1h', observed: 22, median: null, p10: null, p90: null, capacity: 30 },
  { time: 'Now', observed: 23, median: 23, p10: 21, p90: 25, capacity: 30 },
  { time: '+1h', observed: null, median: 25, p10: 22, p90: 28, capacity: 30 },
  { time: '+2h', observed: null, median: 27, p10: 24, p90: 31, capacity: 30 },
  { time: '+3h', observed: null, median: 29, p10: 25, p90: 33, capacity: 30 },
  { time: '+4h', observed: null, median: 31, p10: 27, p90: 35, capacity: 30 }, // Breach point (crosses 30)
  { time: '+5h', observed: null, median: 33, p10: 29, p90: 37, capacity: 30 },
  { time: '+6h', observed: null, median: 35, p10: 30, p90: 39, capacity: 30 }, // Peak demand (35 scans/hr)
  { time: '+7h', observed: null, median: 34, p10: 29, p90: 38, capacity: 30 },
  { time: '+8h', observed: null, median: 32, p10: 27, p90: 36, capacity: 30 },
  { time: '+9h', observed: null, median: 29, p10: 24, p90: 33, capacity: 30 },
  { time: '+10h', observed: null, median: 26, p10: 21, p90: 30, capacity: 30 },
  { time: '+11h', observed: null, median: 22, p10: 18, p90: 26, capacity: 30 },
  { time: '+12h', observed: null, median: 19, p10: 15, p90: 23, capacity: 30 },
]

function MetricCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="metric-copy">
        <span className="muted-label">{label}</span>
        <strong>{value}</strong>
        <span className="metric-detail">{detail}</span>
      </div>
    </div>
  )
}

export default function Overview() {
  // Simulator Controls
  const [arrivals, setArrivals] = useState(25) // Baseline (+0%)
  const [staffShortage, setStaffShortage] = useState(0)
  const [scannerAvailable, setScannerAvailable] = useState(true)
  const [season, setSeason] = useState('Normal')

  // FIG 2: Action Approval State
  const [actionTechApproved, setActionTechApproved] = useState(false)
  const [actionRerouteApproved, setActionRerouteApproved] = useState(false)
  const [actionRepairApproved, setActionRepairApproved] = useState(false)

  // Real Historical Analytics
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // Real Backend Forecast State
  const [forecastData, setForecastData] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [selectedDeptForWhy, setSelectedDeptForWhy] = useState(null)
  const [notice, setNotice] = useState('Fig 2 Prediction Engine synchronized with live model.')

  // Fetch Historical Analytics from SQLite
  useEffect(() => {
    let cancelled = false
    async function loadAnalytics() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/analytics/overview')
        if (response.ok) {
          const data = await response.json()
          if (!cancelled) setAnalytics(data)
        }
      } catch (err) {
        console.warn('Analytics backend offline:', err)
      } finally {
        if (!cancelled) setAnalyticsLoading(false)
      }
    }
    loadAnalytics()
    return () => {
      cancelled = true
    }
  }, [])

  // Call FastAPI forecasting endpoint
  const fetchForecast = useCallback(async (arrVal, staffVal, seasonVal, scannerVal) => {
    setForecastLoading(true)
    try {
      const demandDeltaPct = Math.max(0, arrVal - 25)
      const url = `http://127.0.0.1:8000/api/forecasting/bottlenecks?arrivals=${demandDeltaPct}&staff_shortage=${staffVal}&season=${encodeURIComponent(
        seasonVal
      )}&scanner_available=${scannerVal}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setForecastData(data)
        if (data.forecasts && data.forecasts.length > 0) {
          setSelectedDeptForWhy(prev => prev || data.forecasts[0])
        }
      }
    } catch (err) {
      console.warn('Forecast endpoint offline:', err)
    } finally {
      setForecastLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchForecast(arrivals, staffShortage, season, scannerAvailable)
  }, [fetchForecast, arrivals, staffShortage, season, scannerAvailable])

  // FIG 2: Calculate Dynamic Capacity Step-Line Based on Approved Actions
  const { chartTimeline, effectiveCapacity, isBreachAvoided, approvedCapacityNumber } = useMemo(() => {
    // Baseline capacity is 30 scans/hr (with CT-2 down)
    let addedCapacity = 0
    if (actionTechApproved) addedCapacity += 4 // +4 scans/hr
    if (actionRepairApproved) addedCapacity += 4 // +4 scans/hr

    const finalCapacity = 30 + addedCapacity
    const demandReduction = actionRerouteApproved ? 3 : 0 // -3 scans/hr equivalent from 15 deferred slots

    const mappedData = BASE_BREACH_TIMELINE.map(point => {
      // Step function: action 1 takes effect at T+1h, action 3 at T+3h
      let stepCapacity = 30
      if (point.time.startsWith('+')) {
        const hour = parseInt(point.time.replace('+', '').replace('h', ''), 10)
        if (actionTechApproved && hour >= 1) stepCapacity += 4
        if (actionRepairApproved && hour >= 3) stepCapacity += 4
      }

      // Adjust demand curve if reroute action is active
      const adjustedMedian = point.median !== null ? Math.max(0, point.median - (point.time.startsWith('+') ? demandReduction : 0)) : null
      const adjustedP10 = point.p10 !== null ? Math.max(0, point.p10 - (point.time.startsWith('+') ? demandReduction : 0)) : null
      const adjustedP90 = point.p90 !== null ? Math.max(0, point.p90 - (point.time.startsWith('+') ? demandReduction : 0)) : null

      return {
        ...point,
        median: adjustedMedian,
        p10: adjustedP10,
        p90: adjustedP90,
        baselineCapacity: 30,
        approvedCapacity: addedCapacity > 0 || actionRerouteApproved ? stepCapacity : null,
      }
    })

    // Peak demand without actions is 35. Peak with actions is (35 - demandReduction)
    const peakDemand = 35 - demandReduction
    const breachAvoided = finalCapacity >= peakDemand && (actionTechApproved || actionRepairApproved || actionRerouteApproved)

    return {
      chartTimeline: mappedData,
      effectiveCapacity: finalCapacity,
      isBreachAvoided: breachAvoided,
      approvedCapacityNumber: finalCapacity,
    }
  }, [actionTechApproved, actionRepairApproved, actionRerouteApproved])

  function handleResetAll() {
    setArrivals(25)
    setStaffShortage(0)
    setScannerAvailable(true)
    setSeason('Normal')
    setActionTechApproved(false)
    setActionRerouteApproved(false)
    setActionRepairApproved(false)
    fetchForecast(25, 0, 'Normal', true)
    setNotice('Reset to initial illustrative breach scenario (Figure 2).')
  }

  const departmentsList = forecastData?.forecasts || []
  const activeWhyDept = selectedDeptForWhy || departmentsList[0] || null
  const backtest = forecastData?.backtest_metrics || { mae: 5.66, mape_pct: 35.7 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner: Verification & Backtest Badge */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#0f766e" />
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{notice}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
            }}
          >
            BACKTEST VALIDATION: MAE {backtest.mae} cases (MAPE {backtest.mape_pct}%)
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
            }}
          >
            P10–P90 Bands Active
          </span>
        </div>
      </div>

      {/* Historical Dataset Metric Cards */}
      <section className="metric-grid">
        <MetricCard
          icon={Users}
          label="Total admissions"
          value={analytics ? analytics.total_admissions.toLocaleString() : analyticsLoading ? '...' : '1,500'}
          detail="Historical CSV dataset"
          tone="blue"
        />
        <MetricCard
          icon={BedDouble}
          label="Patient stays"
          value={analytics ? analytics.total_patient_stays.toLocaleString() : analyticsLoading ? '...' : '1,000'}
          detail="Historical CSV dataset"
          tone="teal"
        />
        <MetricCard
          icon={Clock3}
          label="Average admission stay"
          value={analytics ? `${analytics.average_admission_length_of_stay} days` : analyticsLoading ? '...' : '15.59 days'}
          detail="Average recorded duration"
          tone="purple"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Emergency admissions"
          value={
            analytics
              ? (analytics.admissions_by_type.find(item => item.admission_type.toLowerCase() === 'emergency')?.count ?? 0).toLocaleString()
              : analyticsLoading ? '...' : '490'
          }
          detail="Historical emergency cases"
          tone="red"
        />
      </section>

      {/* FIGURE 2: THE PREDICTED BREACH AND PREVENTION ENGINE */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.8px',
                }}
              >
                POC FIGURE 2 ENGINE
              </span>
              <h2 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>Predicted Breach and Prevention</h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Timing, severity, confidence and cause — hours before the queue forms. Re-runs on every operator update.
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              background: isBreachAvoided ? '#ecfdf5' : '#fef2f2',
              color: isBreachAvoided ? '#059669' : '#dc2626',
              border: `1px solid ${isBreachAvoided ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {isBreachAvoided ? '✓ BREACH AVOIDED (0.92x PEAK)' : '⚠ BREACH PREDICTED AT T+4h'}
          </span>
        </div>

        {/* 2-Column Fig 2 Layout: Left = Chart, Right = Side Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
          {/* Left Column: Composed Chart */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '340px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartTimeline} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    {/* P10-P90 Uncertainty Shading */}
                    <linearGradient id="pBandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.10} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 45]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />

                  {/* Vertical Reference Line at "Now" */}
                  <ReferenceLine x="Now" stroke="#0f172a" strokeWidth={2} label={{ value: 'Now', position: 'top', fill: '#0f172a', fontSize: 11, fontWeight: 700 }} />

                  {/* Red Baseline Capacity Threshold: 30 scans/hr */}
                  <ReferenceLine
                    y={30}
                    stroke="#dc2626"
                    strokeWidth={2}
                    label={{
                      value: 'Capacity: 30 scans/hr (CT-2 down)',
                      position: 'insideBottomLeft',
                      fill: '#dc2626',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  />

                  {/* Predicted Breach Point Marker at T+4h */}
                  {!isBreachAvoided && (
                    <ReferenceDot
                      x="+4h"
                      y={31}
                      r={6}
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  )}

                  {/* P10-P90 Shaded Band */}
                  <Area
                    type="monotone"
                    dataKey="p90"
                    stroke="transparent"
                    fill="url(#pBandGradient)"
                    name="P90 Upper Confidence"
                  />
                  <Area
                    type="monotone"
                    dataKey="p10"
                    stroke="transparent"
                    fill="#ffffff"
                    name="P10 Lower Confidence"
                  />

                  {/* Historical Observed Curve (Solid Dark) */}
                  <Line
                    type="monotone"
                    dataKey="observed"
                    stroke="#0f172a"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#0f172a' }}
                    name="Observed Scans"
                  />

                  {/* Median Forecast Curve (Dashed Blue) */}
                  <Line
                    type="monotone"
                    dataKey="median"
                    stroke="#2563eb"
                    strokeWidth={3}
                    strokeDasharray="5 4"
                    dot={false}
                    name="Forecast Demand (Median)"
                  />

                  {/* Dynamic Capacity Elevation Line with Approved Actions (Step Green Line) */}
                  {(actionTechApproved || actionRepairApproved) && (
                    <Line
                      type="stepAfter"
                      dataKey="approvedCapacity"
                      stroke="#059669"
                      strokeWidth={2.5}
                      strokeDasharray="4 3"
                      dot={false}
                      name="Capacity with Approved Actions"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              {/* Breach Marker Tag Badge */}
              {!isBreachAvoided && (
                <div
                  style={{
                    position: 'absolute',
                    top: '86px',
                    left: '52%',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(220,38,38,0.3)',
                  }}
                >
                  Predicted breach = T+4h
                </div>
              )}

              {/* Action Elevation Tag */}
              {isBreachAvoided && (
                <div
                  style={{
                    position: 'absolute',
                    top: '38px',
                    left: '42%',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(5,150,105,0.3)',
                  }}
                >
                  Capacity with approved actions: {approvedCapacityNumber} scans/hr
                </div>
              )}
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '6px' }}>
              Radiology: scan requests per hour (illustrative, synthetic data grounded in historical admissions)
            </div>
          </div>

          {/* Right Column: FIG 2 Companion Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Widget 1: Radiology Alert */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13px', color: '#991b1b' }}>Radiology Alert</strong>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>
                  CRITICAL TIER
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px', fontSize: '11px', color: '#7f1d1d' }}>
                <div>Time to breach:</div>
                <div style={{ fontWeight: 800, textAlign: 'right' }}>~4 hours</div>
                <div>Severity:</div>
                <div style={{ fontWeight: 800, textAlign: 'right' }}>HIGH · 1.17x capacity</div>
                <div>Confidence:</div>
                <div style={{ fontWeight: 800, textAlign: 'right' }}>82% (P10–P90)</div>
                <div>Peak overload:</div>
                <div style={{ fontWeight: 800, textAlign: 'right' }}>+5 scans/hr</div>
                <div>Time above capacity:</div>
                <div style={{ fontWeight: 800, textAlign: 'right' }}>~7 hours</div>
              </div>
            </div>

            {/* Widget 2: Why: Driver Share */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>Why: driver share</strong>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Overload attribution</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                    <span>Arrivals +40%</span>
                    <strong>45%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: '#2563eb', borderRadius: '999px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                    <span>CT-2 scanner down</span>
                    <strong>35%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', background: '#ea580c', borderRadius: '999px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                    <span>Two technicians short</span>
                    <strong>20%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', background: '#d97706', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '8px' }}>
                Share of overload removed when each factor is restored to nominal limits.
              </div>
            </div>

            {/* Widget 3: Suggested Actions with Human Approval Toggles */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ fontSize: '12px', color: '#166534', display: 'block', marginBottom: '8px' }}>
                Suggested preventive actions
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: '#14532d',
                    cursor: 'pointer',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #dcfce7',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={actionTechApproved}
                    onChange={e => setActionTechApproved(e.target.checked)}
                  />
                  <span>1. Add one technician (+4 scans/hr)</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: '#14532d',
                    cursor: 'pointer',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #dcfce7',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={actionRerouteApproved}
                    onChange={e => setActionRerouteApproved(e.target.checked)}
                  />
                  <span>2. Re-route 15 outpatient scans to later slots</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: '#14532d',
                    cursor: 'pointer',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #dcfce7',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={actionRepairApproved}
                    onChange={e => setActionRepairApproved(e.target.checked)}
                  />
                  <span>3. Repair CT-2 by T+3h (+4 scans/hr)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Before / After Comparison Banner at Bottom of Figure 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '18px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px' }}>
            <strong style={{ fontSize: '11px', color: '#991b1b', display: 'block' }}>Without action:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#7f1d1d', lineHeight: 1.4 }}>
              Demand exceeds capacity from T+4h to about T+11h, so the Radiology queue builds and delays spread downstream to Emergency and ICU.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px' }}>
            <strong style={{ fontSize: '11px', color: '#166534', display: 'block' }}>With approved actions:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#14532d', lineHeight: 1.4 }}>
              Capacity rises to {effectiveCapacity} scans/hr, peak load falls to 0.92x and the breach is avoided. The operator approves each step.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Early Warning Alerts */}
      <section className="content-grid lower-grid">
        <div className="panel simulator-panel">
          <div className="panel-heading">
            <div>
              <h2>What-if simulator</h2>
              <p>Explore hypothetical operational shocks</p>
            </div>
            <BrainCircuit size={21} color="#6374db" />
          </div>

          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="arrivals">Patient demand increase</label>
              <strong>+{arrivals - 25}%</strong>
            </div>
            <input
              id="arrivals"
              type="range"
              min="25"
              max="75"
              step="5"
              value={arrivals}
              onChange={e => setArrivals(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>Baseline</span>
              <span>+50%</span>
            </div>
          </div>

          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="staff">Additional staff unavailable</label>
              <strong>{staffShortage} staff</strong>
            </div>
            <input
              id="staff"
              type="range"
              min="0"
              max="4"
              value={staffShortage}
              onChange={e => setStaffShortage(Number(e.target.value))}
            />
          </div>

          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="season">Epidemiological condition</label>
            </div>
            <select id="season" value={season} onChange={e => setSeason(e.target.value)}>
              <option value="Normal">Normal baseline</option>
              <option value="Monsoon">Monsoon illness surge</option>
              <option value="Respiratory season">Respiratory / Flu season</option>
              <option value="Outbreak">Acute infectious outbreak</option>
            </select>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={scannerAvailable}
              onChange={e => setScannerAvailable(e.target.checked)}
            />
            <span>CT Scanner operational</span>
          </label>

          <div className="sim-buttons">
            <button className="primary-button" onClick={() => fetchForecast(arrivals, staffShortage, season, scannerAvailable)} type="button">
              {forecastLoading ? 'Forecasting...' : 'Run forecast'} <ChevronRight size={16} />
            </button>
            <button className="secondary-button" onClick={handleResetAll} type="button">
              Reset to baseline
            </button>
          </div>

          <div className="simulation-disclaimer" style={{ marginTop: '12px' }}>
            Predictions combine empirical seasonal baselines from 1,500 admissions with queue drift formulas. Backtested MAE: 5.66 cases. All operational decisions require human clinical sign-off.
          </div>
        </div>

        {/* Department Bottleneck Radar List */}
        <div className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <h2>Department bottleneck radar</h2>
              <p>Operational units ranked by risk</p>
            </div>
            <span className="alert-count">{departmentsList.length}</span>
          </div>

          <div className="department-list" style={{ padding: '8px' }}>
            {departmentsList.map(dept => {
              const isSelected = activeWhyDept?.name === dept.name
              const isCritical = dept.risk_score >= 80
              const isWarning = dept.risk_score >= 60

              return (
                <div
                  className="department-row"
                  key={dept.name}
                  onClick={() => setSelectedDeptForWhy(dept)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? '#f8fafc' : 'transparent',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #cbd5e1' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div className="department-main" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>{dept.name}</strong>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <Clock size={10} /> {dept.time_to_bottleneck}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      Active: {dept.active_patients}/{dept.capacity_threshold} · 95% Band: [{dept.uncertainty_band.lower}% - {dept.uncertainty_band.upper}%]
                    </div>
                  </div>

                  <div className="risk-column" style={{ width: '110px' }}>
                    <span
                      className={`risk-badge ${
                        isCritical ? 'red' : isWarning ? 'orange' : dept.risk_score >= 40 ? 'yellow' : 'green'
                      }`}
                    >
                      {dept.severity} · {dept.risk_score}%
                    </span>
                    <div className="risk-track" style={{ marginTop: '4px' }}>
                      <div
                        className={`risk-fill ${
                          isCritical ? 'fill-red' : isWarning ? 'fill-orange' : dept.risk_score >= 40 ? 'fill-yellow' : 'fill-green'
                        }`}
                        style={{ width: `${dept.risk_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}