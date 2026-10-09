import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BedDouble,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
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
} from 'recharts'

// Immutable baseline data — never mutate this directly
const INITIAL_DEPARTMENTS = [
  { name: 'Emergency', patients: 32, capacity: 70, risk: 32, staff: 12, pending: 8 },
  { name: 'Radiology', patients: 26, capacity: 95, risk: 82, staff: 4, pending: 18 },
  { name: 'ICU', patients: 14, capacity: 85, risk: 67, staff: 9, pending: 5 },
  { name: 'Pathology', patients: 21, capacity: 75, risk: 48, staff: 6, pending: 12 },
  { name: 'Pharmacy', patients: 35, capacity: 65, risk: 29, staff: 8, pending: 4 },
]

const INITIAL_TREND_DATA = [
  { time: '08:00', demand: 18, capacity: 30 },
  { time: '09:00', demand: 20, capacity: 30 },
  { time: '10:00', demand: 24, capacity: 30 },
  { time: '11:00', demand: 30, capacity: 30 },
  { time: '12:00', demand: 35, capacity: 30 },
  { time: '13:00', demand: 39, capacity: 30 },
  { time: '14:00', demand: 34, capacity: 30 },
  { time: '15:00', demand: 27, capacity: 30 },
]

const INITIAL_ALERTS = [
  {
    id: 'base-1',
    isSimulated: false,
    level: 'critical',
    department: 'Radiology',
    message: 'Scanner capacity may be exceeded in approximately 2 hours.',
    time: 'Recorded',
  },
  {
    id: 'base-2',
    isSimulated: false,
    level: 'warning',
    department: 'ICU',
    message: 'Staff availability is approaching the configured threshold.',
    time: '8 min ago',
  },
]

function RiskBadge({ risk }) {
  const level = risk >= 80 ? 'Critical' : risk >= 60 ? 'High' : risk >= 40 ? 'Moderate' : 'Low'
  const color = risk >= 80 ? 'red' : risk >= 60 ? 'orange' : risk >= 40 ? 'yellow' : 'green'

  return (
    <span className={`risk-badge ${color}`}>
      <span className="status-dot" />
      {level} · {risk}%
    </span>
  )
}

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
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS)
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [arrivals, setArrivals] = useState(25)
  const [staffShortage, setStaffShortage] = useState(0)
  const [scannerAvailable, setScannerAvailable] = useState(true)
  const [season, setSeason] = useState('Normal')
  const [disasterType, setDisasterType] = useState('None')
  const [disasterSeverity, setDisasterSeverity] = useState('Moderate')
  const [waterSupply, setWaterSupply] = useState('Normal')
  const [roadAccess, setRoadAccess] = useState('Normal')
  const [powerSupply, setPowerSupply] = useState('Normal')
  const [disasterImpact, setDisasterImpact] = useState(null)
  const [notice, setNotice] = useState('Baseline illustrative data loaded.')

  // Historical analytics from FastAPI backend
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAnalytics() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/analytics/overview')
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        const data = await response.json()
        if (!cancelled) {
          setAnalytics(data)
          setAnalyticsError('')
        }
      } catch (error) {
        if (!cancelled) {
          setAnalyticsError(error.message)
        }
      } finally {
        if (!cancelled) {
          setAnalyticsLoading(false)
        }
      }
    }

    loadAnalytics()
    return () => {
      cancelled = true
    }
  }, [])

  function runSimulation() {
    const severityPoints = {
      Low: 5,
      Moderate: 12,
      Severe: 22,
      Extreme: 35,
    }

    const severity = disasterType === 'None' ? 0 : severityPoints[disasterSeverity]
    const seasonalFactor =
      season === 'Monsoon' ? 12 :
      season === 'Respiratory season' ? 16 :
      season === 'Outbreak' ? 25 : 0

    const demandIncrease = Math.max(0, arrivals - 25) * 0.7
    const equipmentPenalty = scannerAvailable ? 0 : 18

    const recommendations = []

    // Always compute strictly against the immutable INITIAL_DEPARTMENTS baseline
    const newDepartments = INITIAL_DEPARTMENTS.map(baselineDept => {
      let extraRisk = demandIncrease + seasonalFactor
      const name = baselineDept.name.toLowerCase()

      // Environmental impact vectors
      if (disasterType === 'Flood') {
        if (name.includes('emergency') || name.includes('icu')) {
          extraRisk += severity
        }
        if (name.includes('radiology') || name.includes('pathology')) {
          extraRisk += severity * 0.6
        }
      }

      if (disasterType === 'Drought') {
        if (name.includes('emergency') || name.includes('general medicine')) {
          extraRisk += severity
        }
        if (name.includes('icu')) {
          extraRisk += severity * 0.7
        }
      }

      if (disasterType === 'Heatwave') {
        if (name.includes('emergency') || name.includes('general medicine') || name.includes('icu')) {
          extraRisk += severity
        }
      }

      if (waterSupply === 'Restricted') extraRisk += 8
      if (waterSupply === 'Unavailable') extraRisk += 20

      if (roadAccess === 'Disrupted') extraRisk += 7
      if (roadAccess === 'Blocked') extraRisk += 15

      if (powerSupply === 'Restricted') extraRisk += 8
      if (powerSupply === 'Backup power only') extraRisk += 15

      if (name.includes('radiology')) {
        extraRisk += equipmentPenalty + staffShortage * 7
      } else {
        extraRisk += staffShortage * 2
      }

      const calculatedRisk = Math.max(5, Math.min(99, Math.round(baselineDept.risk + extraRisk)))

      return {
        ...baselineDept,
        risk: calculatedRisk,
      }
    })

    if (disasterType !== 'None') {
      recommendations.push(`Review the ${disasterSeverity.toLowerCase()} ${disasterType.toLowerCase()} contingency plan.`)
    }
    if (waterSupply !== 'Normal') {
      recommendations.push('Review water reserves, essential clinical uses and backup arrangements.')
    }
    if (roadAccess !== 'Normal') {
      recommendations.push('Check ambulance access, alternative routes and essential supply deliveries.')
    }
    if (powerSupply !== 'Normal') {
      recommendations.push('Verify backup power, critical equipment and escalation procedures.')
    }
    if (staffShortage > 0) {
      recommendations.push('Review staff coverage and consider approved redeployment arrangements.')
    }
    if (arrivals > 25) {
      recommendations.push('Review projected patient demand and available department capacity.')
    }
    if (recommendations.length === 0) {
      recommendations.push('Baseline simulation values selected. Continue routine monitoring.')
    }

    const highestRiskDepartment = newDepartments.reduce((highest, current) =>
      current.risk > highest.risk ? current : highest
    )

    const highRiskDepartments = newDepartments.filter(dept => dept.risk >= 80)

    setDepartments(newDepartments)
    setDisasterImpact({
      disasterType,
      disasterSeverity: disasterType === 'None' ? 'Not applicable' : disasterSeverity,
      highestRiskDepartment: highestRiskDepartment.name,
      highestRisk: highestRiskDepartment.risk,
      highRiskDepartments: highRiskDepartments.map(d => d.name),
      recommendations,
    })

    setNotice(
      `Simulation active. Highest estimated risk: ${highestRiskDepartment.name} (${highestRiskDepartment.risk}%). Illustrative scenario only.`
    )

    // Deduplicate alerts: remove any existing simulated alerts before appending a new one
    if (highRiskDepartments.length > 0) {
      const simulatedAlert = {
        id: 'simulated-risk-alert',
        isSimulated: true,
        level: 'critical',
        department: highestRiskDepartment.name,
        message: `Illustrative scenario risk reached ${highestRiskDepartment.risk}%. Review operational conditions and recommended precautions.`,
        time: 'Simulated',
      }
      setAlerts(prev => [simulatedAlert, ...prev.filter(a => !a.isSimulated)])
    } else {
      setAlerts(prev => prev.filter(a => !a.isSimulated))
    }
  }

  function resetSimulation() {
    setDepartments(INITIAL_DEPARTMENTS)
    setAlerts(INITIAL_ALERTS)
    setArrivals(25)
    setStaffShortage(0)
    setScannerAvailable(true)
    setSeason('Normal')
    setDisasterType('None')
    setDisasterSeverity('Moderate')
    setWaterSupply('Normal')
    setRoadAccess('Normal')
    setPowerSupply('Normal')
    setDisasterImpact(null)
    setNotice('Data reset to the baseline illustrative scenario.')
  }

  function acknowledgeAlert(id) {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
    setNotice('Alert acknowledged locally. Human action logged in prototype.')
  }

  return (
    <div>
      <div className="notice-bar">
        <Activity size={16} />
        {analyticsLoading
          ? 'Connecting to historical analytics API...'
          : analyticsError
          ? `Analytics offline: ${analyticsError} (FastAPI backend offline on port 8000)`
          : notice}
      </div>

      {/* Historical Dataset Metric Cards */}
      <section className="metric-grid">
        <MetricCard
          icon={Users}
          label="Total admissions"
          value={
            analytics
              ? analytics.total_admissions.toLocaleString()
              : analyticsLoading ? '...' : '1,500'
          }
          detail="Historical CSV dataset"
          tone="blue"
        />

        <MetricCard
          icon={BedDouble}
          label="Patient stays"
          value={
            analytics
              ? analytics.total_patient_stays.toLocaleString()
              : analyticsLoading ? '...' : '1,000'
          }
          detail="Historical CSV dataset"
          tone="teal"
        />

        <MetricCard
          icon={Clock3}
          label="Average admission stay"
          value={
            analytics
              ? `${analytics.average_admission_length_of_stay} days`
              : analyticsLoading ? '...' : '15.59 days'
          }
          detail="Average recorded duration"
          tone="purple"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Emergency admissions"
          value={
            analytics
              ? (
                  analytics.admissions_by_type.find(
                    item => item.admission_type.toLowerCase() === 'emergency'
                  )?.count ?? 0
                ).toLocaleString()
              : analyticsLoading ? '...' : '490'
          }
          detail="Historical emergency cases"
          tone="red"
        />
      </section>

      {/* Mid-Row: Bottleneck Risk Bars & Hourly Area Chart */}
      <section className="content-grid">
        <div className="panel department-panel">
          <div className="panel-heading">
            <div>
              <h2>Department bottleneck risk</h2>
              <p>Illustrative operational risk estimates</p>
            </div>
            <span className="live-label">
              <span className="pulse-dot" /> DEMO LIVE
            </span>
          </div>

          <div className="department-list">
            {departments.map(department => (
              <div className="department-row" key={department.name}>
                <div className="department-main">
                  <div className="department-name">{department.name}</div>
                  <div className="department-sub">
                    {department.patients} patients · {department.pending} pending tasks · {department.staff} staff
                  </div>
                </div>
                <div className="risk-column">
                  <RiskBadge risk={department.risk} />
                  <div className="risk-track">
                    <div
                      className={`risk-fill ${
                        department.risk >= 80
                          ? 'fill-red'
                          : department.risk >= 60
                          ? 'fill-orange'
                          : department.risk >= 40
                          ? 'fill-yellow'
                          : 'fill-green'
                      }`}
                      style={{ width: `${department.risk}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel forecast-panel">
          <div className="panel-heading">
            <div>
              <h2>Demand vs capacity</h2>
              <p>Illustrative hourly workload</p>
            </div>
            <span className="chart-tag">NEXT 8 HOURS</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INITIAL_TREND_DATA} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2784ee" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#2784ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9edf4" />
                <XAxis dataKey="time" tick={{ fill: '#7c8799', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#7c8799', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="capacity"
                  name="Illustrative capacity"
                  stroke="#d97757"
                  strokeDasharray="5 4"
                  fill="transparent"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="demand"
                  name="Illustrative demand"
                  stroke="#2784ee"
                  fill="url(#demandFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-foot">
            <span><i className="legend-blue" /> Forecast demand</span>
            <span><i className="legend-orange" /> Available capacity</span>
          </div>
        </div>
      </section>

      {/* Lower Row: What-If Simulator & Active Alerts */}
      <section className="content-grid lower-grid">
        <div className="panel simulator-panel">
          <div className="panel-heading">
            <div>
              <h2>What-if simulator</h2>
              <p>Explore hypothetical operational changes</p>
            </div>
            <BrainCircuit size={21} color="#6374db" />
          </div>

          {/* 1. Demand Slider */}
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

          {/* 2. Staff Shortage Slider */}
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

          {/* 3. Season / Clinical Condition */}
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

          {/* 4. Environmental Scenario */}
          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="disasterType">Climate & environmental event</label>
            </div>
            <select
              id="disasterType"
              value={disasterType}
              onChange={e => setDisasterType(e.target.value)}
            >
              <option value="None">None (Routine operations)</option>
              <option value="Flood">Urban flood</option>
              <option value="Drought">Severe drought</option>
              <option value="Heatwave">Extreme heatwave</option>
            </select>
          </div>

          {/* 5. Scenario Severity */}
          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="disasterSeverity">Event severity</label>
            </div>
            <select
              id="disasterSeverity"
              value={disasterSeverity}
              onChange={e => setDisasterSeverity(e.target.value)}
              disabled={disasterType === 'None'}
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          {/* 6. Utility Infrastructure Constraints */}
          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="waterSupply">Municipal water supply</label>
            </div>
            <select
              id="waterSupply"
              value={waterSupply}
              onChange={e => setWaterSupply(e.target.value)}
            >
              <option value="Normal">Normal supply</option>
              <option value="Restricted">Restricted (low pressure)</option>
              <option value="Unavailable">Interrupted (reserve tanks only)</option>
            </select>
          </div>

          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="roadAccess">Emergency vehicle road access</label>
            </div>
            <select
              id="roadAccess"
              value={roadAccess}
              onChange={e => setRoadAccess(e.target.value)}
            >
              <option value="Normal">Normal access</option>
              <option value="Disrupted">Disrupted traffic</option>
              <option value="Blocked">Blocked / flooded routes</option>
            </select>
          </div>

          <div className="sim-control">
            <div className="control-label">
              <label htmlFor="powerSupply">Power grid status</label>
            </div>
            <select
              id="powerSupply"
              value={powerSupply}
              onChange={e => setPowerSupply(e.target.value)}
            >
              <option value="Normal">Normal grid supply</option>
              <option value="Restricted">Restricted / fluctuating</option>
              <option value="Backup power only">Backup generator active</option>
            </select>
          </div>

          {/* 7. Equipment Toggles */}
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={scannerAvailable}
              onChange={e => setScannerAvailable(e.target.checked)}
            />
            <span>CT Scanner operational</span>
          </label>

          <div className="sim-buttons">
            <button className="primary-button" onClick={runSimulation} type="button">
              Run simulation <ChevronRight size={16} />
            </button>
            <button className="secondary-button" onClick={resetSimulation} type="button">
              Reset to baseline
            </button>
          </div>

          {disasterImpact && (
            <div
              className="simulation-disclaimer"
              style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#0f172a' }}>
                Scenario Impact Summary ({disasterImpact.disasterType} · {disasterImpact.disasterSeverity})
              </h3>
              <p style={{ margin: '0 0 4px 0' }}>
                Highest estimated risk: <strong>{disasterImpact.highestRiskDepartment}</strong> ({disasterImpact.highestRisk}%)
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Critical threshold (≥80%): {disasterImpact.highRiskDepartments.length > 0 ? disasterImpact.highRiskDepartments.join(', ') : 'None'}
              </p>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '10px' }}>Recommended Preventive Actions:</h4>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {disasterImpact.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="simulation-disclaimer">
            Simulation uses illustrative rules, not a validated clinical forecasting model. Hospital staff must approve all actions.
          </div>
        </div>

        {/* Active Alerts Section */}
        <div className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <h2>Active alerts</h2>
              <p>Operational risks requiring review</p>
            </div>
            <span className="alert-count">{alerts.length}</span>
          </div>

          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="empty-alerts">
                <CheckCircle2 size={23} />
                <span>No active alerts. Routine monitoring active.</span>
              </div>
            ) : (
              alerts.map(alert => (
                <div className={`alert-item ${alert.level}`} key={alert.id}>
                  <div className="alert-symbol">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="alert-copy">
                    <div className="alert-title">
                      {alert.department} · {alert.level === 'critical' ? 'Critical Risk' : 'Warning'}
                    </div>
                    <p>{alert.message}</p>
                    <span>{alert.time}</span>
                    <button
                      className="ack-button"
                      onClick={() => acknowledgeAlert(alert.id)}
                      type="button"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}