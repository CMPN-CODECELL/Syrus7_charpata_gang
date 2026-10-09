import { useEffect, useState } from 'react'
import {
Activity,
AlertTriangle,
BedDouble,
Bell,
BrainCircuit,
CheckCircle2,
ChevronRight,
Clock3,
LayoutDashboard,
Radio,
Settings,
ShieldCheck,
Users,
Wrench,
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
import './App.css'

const initialDepartments = [
{ name: 'Emergency', patients: 32, capacity: 70, risk: 32, staff: 12, pending: 8 },
{ name: 'Radiology', patients: 26, capacity: 95, risk: 82, staff: 4, pending: 18 },
{ name: 'ICU', patients: 14, capacity: 85, risk: 67, staff: 9, pending: 5 },
{ name: 'Pathology', patients: 21, capacity: 75, risk: 48, staff: 6, pending: 12 },
{ name: 'Pharmacy', patients: 35, capacity: 65, risk: 29, staff: 8, pending: 4 },
]

const trendData = [
{ time: '08:00', demand: 18, capacity: 30 },
{ time: '09:00', demand: 20, capacity: 30 },
{ time: '10:00', demand: 24, capacity: 30 },
{ time: '11:00', demand: 30, capacity: 30 },
{ time: '12:00', demand: 35, capacity: 30 },
{ time: '13:00', demand: 39, capacity: 30 },
{ time: '14:00', demand: 34, capacity: 30 },
{ time: '15:00', demand: 27, capacity: 30 },
]

const initialAlerts = [
{ id: 1, level: 'critical', department: 'Radiology', message: 'Scanner capacity may be exceeded in approximately 2 hours.', time: 'Just now' },
{ id: 2, level: 'warning', department: 'ICU', message: 'Staff availability is approaching the configured threshold.', time: '8 min ago' },
]

function RiskBadge({ risk }) {
const level = risk >= 80 ? 'Critical' : risk >= 60 ? 'High' : risk >= 40 ? 'Moderate' : 'Low'
const color = risk >= 80 ? 'red' : risk >= 60 ? 'orange' : risk >= 40 ? 'yellow' : 'green'

return <span className={`risk-badge ${color}`}><span className="status-dot" />{level} · {risk}%</span>
}

function MetricCard({ icon: Icon, label, value, detail, tone }) {
return ( <div className="metric-card">
<div className={`metric-icon ${tone}`}><Icon size={19} /></div> <div className="metric-copy"> <span className="muted-label">{label}</span> <strong>{value}</strong> <span className="metric-detail">{detail}</span> </div> </div>
)
}

export default function App() {
const [departments, setDepartments] = useState(initialDepartments)
const [alerts, setAlerts] = useState(initialAlerts)
const [arrivals, setArrivals] = useState(25)
const [staffShortage, setStaffShortage] = useState(0)
const [scannerAvailable, setScannerAvailable] = useState(true)
const [season, setSeason] = useState('Normal')
const [notice, setNotice] = useState('Demo data loaded. Predictions are illustrative.')

const [disasterType, setDisasterType] = useState('None')
const [disasterSeverity, setDisasterSeverity] = useState('Moderate')
const [waterSupply, setWaterSupply] = useState('Normal')
const [roadAccess, setRoadAccess] = useState('Normal')
const [powerSupply, setPowerSupply] = useState('Normal')
const [disasterImpact, setDisasterImpact] = useState(null)
// Historical analytics from the FastAPI backend
const [analytics, setAnalytics] = useState(null)
const [analyticsLoading, setAnalyticsLoading] = useState(true)
const [analyticsError, setAnalyticsError] = useState('')

useEffect(() => {
  let cancelled = false

  async function loadAnalytics() {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/analytics/overview'
      )

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

const totalPatients = departments.reduce((sum, d) => sum + d.patients, 0)
const highestRisk = departments.reduce((a, b) => a.risk > b.risk ? a : b)
const criticalCount = departments.filter(d => d.risk >= 80).length
const availableBeds = Math.max(0, 42 - Math.round(totalPatients * 0.11))

function runSimulation() {
  const severityPoints = {
    Low: 5,
    Moderate: 12,
    Severe: 22,
    Extreme: 35,
  }

  const severity = disasterType === 'None'
    ? 0
    : severityPoints[disasterSeverity]

  const seasonalFactor =
    season === 'Monsoon' ? 12
      : season === 'Respiratory season' ? 16
      : season === 'Outbreak' ? 25
      : 0

  const demandIncrease = Math.max(0, arrivals - 25) * 0.7
  const equipmentPenalty = scannerAvailable ? 0 : 18

  const recommendations = []
  const newDepartments = departments.map(department => {
    let extraRisk = demandIncrease + seasonalFactor
    const name = department.name.toLowerCase()

    // Flood scenario: potential emergency and access pressure
    if (disasterType === 'Flood') {
      if (
        name.includes('emergency') ||
        name.includes('icu')
      ) {
        extraRisk += severity
      }

      if (
        name.includes('radiology') ||
        name.includes('pathology') ||
        name.includes('laboratory')
      ) {
        extraRisk += severity * 0.6
      }
    }

    // Drought scenario: potential heat and water-related pressure
    if (disasterType === 'Drought') {
      if (
        name.includes('emergency') ||
        name.includes('general medicine')
      ) {
        extraRisk += severity
      }

      if (
        name.includes('icu') ||
        name.includes('dialysis')
      ) {
        extraRisk += severity * 0.7
      }
    }

    // Heatwave scenario
    if (disasterType === 'Heatwave') {
      if (
        name.includes('emergency') ||
        name.includes('general medicine') ||
        name.includes('icu')
      ) {
        extraRisk += severity
      }
    }

    // Water disruption can affect multiple clinical services
    if (waterSupply === 'Restricted') {
      extraRisk += 8
    }

    if (waterSupply === 'Unavailable') {
      extraRisk += 20
    }

    // Access disruption may affect patient and supply movement
    if (roadAccess === 'Disrupted') {
      extraRisk += 7
    }

    if (roadAccess === 'Blocked') {
      extraRisk += 15
    }

    // Power disruption can affect critical equipment
    if (powerSupply === 'Restricted') {
      extraRisk += 8
    }

    if (powerSupply === 'Backup power only') {
      extraRisk += 15
    }

    if (name.includes('radiology')) {
      extraRisk += equipmentPenalty + staffShortage * 7
    } else {
      extraRisk += staffShortage * 2
    }

    const risk = Math.max(
      5,
      Math.min(99, Math.round(department.risk + extraRisk))
    )

    return { ...department, risk }
  })

  if (disasterType !== 'None') {
    recommendations.push(
      `Review the ${disasterSeverity.toLowerCase()} ${disasterType.toLowerCase()} contingency plan.`
    )
  }

  if (waterSupply !== 'Normal') {
    recommendations.push(
      'Review water reserves, essential clinical uses and backup arrangements.'
    )
  }

  if (roadAccess !== 'Normal') {
    recommendations.push(
      'Check ambulance access, alternative routes and essential supply deliveries.'
    )
  }

  if (powerSupply !== 'Normal') {
    recommendations.push(
      'Verify backup power, critical equipment and escalation procedures.'
    )
  }

  if (staffShortage > 0) {
    recommendations.push(
      'Review staff coverage and consider approved redeployment arrangements.'
    )
  }

  if (arrivals > 25) {
    recommendations.push(
      'Review projected patient demand and available department capacity.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'No additional disaster-related actions selected. Continue routine monitoring.'
    )
  }

  const highestRiskDepartment = newDepartments.reduce(
    (highest, current) =>
      current.risk > highest.risk ? current : highest
  )

  const highRiskDepartments = newDepartments.filter(
    department => department.risk >= 80
  )

  setDepartments(newDepartments)

  setDisasterImpact({
    disasterType,
    disasterSeverity:
      disasterType === 'None' ? 'Not applicable' : disasterSeverity,
    highestRiskDepartment: highestRiskDepartment.name,
    highestRisk: highestRiskDepartment.risk,
    highRiskDepartments: highRiskDepartments.map(
      department => department.name
    ),
    recommendations,
  })

  setNotice(
    `Simulation complete. Highest estimated risk: ${highestRiskDepartment.name} (${highestRiskDepartment.risk}%). Illustrative scenario only.`
  )

    if (highRiskDepartments.length > 0) {
    setAlerts(previous => [
      {
        id: Date.now(),
        level: 'critical',
        department: highestRiskDepartment.name,
        message:
          `Illustrative scenario risk reached ${highestRiskDepartment.risk}%. Review operational conditions and recommended precautions.`,
        time: 'Just now',
      },
      ...previous,
    ])
  }
}

function resetSimulation() {
setDepartments(initialDepartments)
setAlerts(initialAlerts)
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
setNotice('Demo data reset to the initial illustrative scenario.')
}

function acknowledgeAlert(id) {
setAlerts(previous => previous.filter(alert => alert.id !== id))
setNotice('Alert acknowledged locally. Hospital-wide synchronization will be added with the backend.')
}

return ( <div className="app-shell"> <aside className="sidebar"> <div className="brand"> <div className="brand-mark"><ShieldCheck size={25} /></div> <div> <div className="brand-name">FLOWGUARD <span>AI</span></div> <div className="brand-caption">PREDICT · EXPLAIN · PREVENT</div> </div> </div>

```
    <div className="nav-label">WORKSPACE</div>
    <button className="nav-item active"><LayoutDashboard size={18} /> Operations Overview</button>
    <button className="nav-item" onClick={() => setNotice('Patient-flow management will be added in the next milestone.')}><Users size={18} /> Patient Flow</button>
    <button className="nav-item" onClick={() => setNotice('Resource management will be added in the next milestone.')}><Wrench size={18} /> Resources & Staff</button>
    <button className="nav-item" onClick={() => setNotice('Alert management is available in the Active Alerts section.')}><Bell size={18} /> Alerts <span className="nav-count">{alerts.length}</span></button>
    <button className="nav-item" onClick={() => setNotice('Connected View Panels will be implemented with WebSockets.')}><Radio size={18} /> View Panels</button>

    <div className="sidebar-bottom">
      <div className="system-status"><span className="pulse-dot" /> Prototype running</div>
      <div className="sidebar-note">Hospital operations intelligence<br />Synthetic demo environment</div>
    </div>
  </aside>

  <main className="main-area">
    <header className="topbar">
      <div>
        <div className="eyebrow">HOSPITAL OPERATIONS INTELLIGENCE</div>
        <h1>Operations overview</h1>
        <p>Monitor emerging constraints and explore preventive actions.</p>
      </div>
      <div className="topbar-right">
        <span className="demo-pill"><span className="status-dot" /> DEMO ENVIRONMENT</span>
        <div className="avatar">OP</div>
      </div>
    </header>

    <div className="notice-bar">
  <Activity size={16} />

  {analyticsLoading
    ? 'Connecting to historical analytics...'
    : analyticsError
      ? `Analytics connection failed: ${analyticsError}`
      : 'Historical analytics connected successfully. Department simulations remain illustrative.'}
</div>

    <section className="metric-grid">
  <MetricCard
    icon={Users}
    label="Total admissions"
    value={
      analytics
        ? analytics.total_admissions.toLocaleString()
        : analyticsLoading ? '...' : 'Unavailable'
    }
    detail="Historical dataset"
    tone="blue"
  />

  <MetricCard
    icon={BedDouble}
    label="Patient stays"
    value={
      analytics
        ? analytics.total_patient_stays.toLocaleString()
        : analyticsLoading ? '...' : 'Unavailable'
    }
    detail="Historical dataset"
    tone="teal"
  />

  <MetricCard
    icon={Clock3}
    label="Average admission stay"
    value={
      analytics
        ? `${analytics.average_admission_length_of_stay} days`
        : analyticsLoading ? '...' : 'Unavailable'
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
              item =>
                item.admission_type.toLowerCase() === 'emergency'
            )?.count ?? 0
          ).toLocaleString()
        : analyticsLoading ? '...' : 'Unavailable'
    }
    detail="Historical emergency cases"
    tone="red"
  />
</section>

    <section className="content-grid">
      <div className="panel department-panel">
        <div className="panel-heading">
          <div><h2>Department bottleneck risk</h2><p>Illustrative operational risk estimates</p></div>
          <span className="live-label"><span className="pulse-dot" /> DEMO LIVE</span>
        </div>
        <div className="department-list">
          {departments.map(department => (
            <div className="department-row" key={department.name}>
              <div className="department-main">
                <div className="department-name">{department.name}</div>
                <div className="department-sub">{department.patients} patients · {department.pending} pending tasks · {department.staff} staff</div>
              </div>
              <div className="risk-column">
                <RiskBadge risk={department.risk} />
                <div className="risk-track"><div className={`risk-fill ${department.risk >= 80 ? 'fill-red' : department.risk >= 60 ? 'fill-orange' : department.risk >= 40 ? 'fill-yellow' : 'fill-green'}`} style={{ width: `${department.risk}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel forecast-panel">
        <div className="panel-heading">
          <div><h2>Demand vs capacity</h2><p>Illustrative hourly workload</p></div>
          <span className="chart-tag">NEXT 8 HOURS</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
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
              <Area type="monotone" dataKey="capacity" name="Illustrative capacity" stroke="#d97757" strokeDasharray="5 4" fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="demand" name="Illustrative demand" stroke="#2784ee" fill="url(#demandFill)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-foot"><span><i className="legend-blue" /> Forecast demand</span><span><i className="legend-orange" /> Available capacity</span></div>
      </div>
    </section>

    <section className="content-grid lower-grid">
      <div className="panel simulator-panel">
        <div className="panel-heading">
          <div><h2>What-if simulator</h2><p>Explore hypothetical operational changes</p></div>
          <BrainCircuit size={21} color="#6374db" />
        </div>
        <div className="sim-control">
          <div className="control-label"><label htmlFor="arrivals">Patient demand increase</label><strong>+{arrivals - 25}%</strong></div>
          
<div className="sim-control">
  <div className="control-label">
    <label htmlFor="disasterType">Environmental scenario</label>
  </div>
  <select
    id="disasterType"
    value={disasterType}
    onChange={e => setDisasterType(e.target.value)}
  >
    <option value="None">No disaster</option>
    <option value="Flood">Flood</option>
    <option value="Drought">Drought</option>
    <option value="Heatwave">Heatwave</option>
  </select>
</div>

<div className="sim-control">
  <div className="control-label">
    <label htmlFor="disasterSeverity">Scenario severity</label>
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

<div className="sim-control">
  <div className="control-label">
    <label htmlFor="waterSupply">Water supply</label>
  </div>
  <select
    id="waterSupply"
    value={waterSupply}
    onChange={e => setWaterSupply(e.target.value)}
  >
    <option value="Normal">Normal</option>
    <option value="Restricted">Restricted</option>
    <option value="Unavailable">Unavailable</option>
  </select>
</div>

<div className="sim-control">
  <div className="control-label">
    <label htmlFor="roadAccess">Hospital road access</label>
  </div>
  <select
    id="roadAccess"
    value={roadAccess}
    onChange={e => setRoadAccess(e.target.value)}
  >
    <option value="Normal">Normal</option>
    <option value="Disrupted">Disrupted</option>
    <option value="Blocked">Blocked</option>
  </select>
</div>

<div className="sim-control">
  <div className="control-label">
    <label htmlFor="powerSupply">Power supply</label>
  </div>
  <select
    id="powerSupply"
    value={powerSupply}
    onChange={e => setPowerSupply(e.target.value)}
  >
    <option value="Normal">Normal</option>
    <option value="Restricted">Restricted</option>
    <option value="Backup power only">Backup power only</option>
  </select>
</div>
<input id="arrivals" type="range" min="25" max="75" step="5" value={arrivals} onChange={e => setArrivals(Number(e.target.value))} />
          <div className="range-labels"><span>Baseline</span><span>+50%</span></div>
        </div>
        <div className="sim-control">
          <div className="control-label"><label htmlFor="staff">Additional staff unavailable</label><strong>{staffShortage}</strong></div>
          <input id="staff" type="range" min="0" max="4" value={staffShortage} onChange={e => setStaffShortage(Number(e.target.value))} />
        </div>
        <div className="sim-control">
          <div className="control-label"><label htmlFor="season">Demand condition</label></div>
          <select id="season" value={season} onChange={e => setSeason(e.target.value)}>
            <option>Normal</option>
            <option>Monsoon</option>
            <option>Respiratory season</option>
            <option>Outbreak</option>
          </select>
        </div>
        <label className="toggle-row"><input type="checkbox" checked={scannerAvailable} onChange={e => setScannerAvailable(e.target.checked)} /><span>CT scanner available</span></label>
        <div className="sim-buttons">
          <button className="primary-button" onClick={runSimulation}>Run simulation <ChevronRight size={16} /></button>
          <button className="secondary-button" onClick={resetSimulation}>Reset</button>
        </div>
        
{disasterImpact && (
  <div className="simulation-disclaimer">
    <h3>Scenario impact summary</h3>

    <p>
      Scenario: {disasterImpact.disasterType}
      {' · '}
      Severity: {disasterImpact.disasterSeverity}
    </p>

    <p>
      Highest estimated risk: {disasterImpact.highestRiskDepartment}
      {' ('}
      {disasterImpact.highestRisk}%)
    </p>

    <p>
      Departments with estimated risk of 80% or higher:{' '}
      {disasterImpact.highRiskDepartments.length > 0
        ? disasterImpact.highRiskDepartments.join(', ')
        : 'None in this simulation'}
    </p>

    <h4>Suggested preventive actions</h4>

    <ul>
      {disasterImpact.recommendations.map((recommendation, index) => (
        <li key={index}>{recommendation}</li>
      ))}
    </ul>

    <p>
      These are illustrative risk estimates, not validated
      predictions. Hospital staff must review all actions.
    </p>
  </div>
)}
        <div className="simulation-disclaimer">Simulation uses illustrative rules, not a validated clinical or hospital forecasting model.</div>
      </div>

      <div className="panel alerts-panel">
        <div className="panel-heading">
          <div><h2>Active alerts</h2><p>Operational risks requiring review</p></div>
          <span className="alert-count">{alerts.length}</span>
        </div>
        <div className="alerts-list">
          {alerts.length === 0 && <div className="empty-alerts"><CheckCircle2 size={23} /><span>No active demo alerts.</span></div>}
          {alerts.map(alert => (
            <div className={`alert-item ${alert.level}`} key={alert.id}>
              <div className="alert-symbol"><AlertTriangle size={18} /></div>
              <div className="alert-copy">
                <div className="alert-title">{alert.department} · {alert.level === 'critical' ? 'Critical risk' : 'Warning'}</div>
                <p>{alert.message}</p>
                <span>{alert.time}</span>
                <button className="ack-button" onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer className="footer-note">
      <ShieldCheck size={15} /> FlowGuard AI · Prototype only · Synthetic data · Human approval required
     </footer>
  </main>
</div>
)
}