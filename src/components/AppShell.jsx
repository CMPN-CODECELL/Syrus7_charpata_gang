import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  Ambulance,
  BedDouble,
  Bell,
  Cpu,
  GitFork,
  HelpCircle,
  LayoutDashboard,
  Pause,
  Play,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Wrench,
} from 'lucide-react'

export default function AppShell() {
  const location = useLocation()
  const [telemetry, setTelemetry] = useState(null)
  const [isPollingActive, setIsPollingActive] = useState(true)
  const [secondsSinceSync, setSecondsSinceSync] = useState(0)

  // 10-Second Continuous Polling Cycle
  useEffect(() => {
    let timer = null
    let syncCounter = null

    async function pollLiveTelemetry() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/telemetry/live')
        if (response.ok) {
          const data = await response.json()
          setTelemetry(data)
          setSecondsSinceSync(0)
        }
      } catch (err) {
        console.warn('Telemetry stream offline or polling interrupted:', err)
      }
    }

    if (isPollingActive) {
      pollLiveTelemetry() // immediate initial poll
      timer = setInterval(pollLiveTelemetry, 10000)

      syncCounter = setInterval(() => {
        setSecondsSinceSync(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
      if (syncCounter) clearInterval(syncCounter)
    }
  }, [isPollingActive])

  const occupancy = telemetry?.live_metrics?.hospital_census?.occupancy_rate_pct ?? 87.6
  const ambulances = telemetry?.live_metrics?.inbound_transfers?.active_ambulances ?? 3
  const statusLabel = telemetry?.live_metrics?.hospital_status ?? 'Continuous Polling Active'

  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <aside className="app-sidebar">
        <div className="brand-section">
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>
          <div className="brand-text">
            <strong>FLOWGUARD AI</strong>
            <span>CLINICAL OPERATIONS</span>
          </div>
        </div>

        <div className="nav-category">CORE PLATFORM</div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Operations Overview</span>
          </NavLink>

          <NavLink
            to="/patient-flow"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Patient Flow</span>
            <span className="nav-badge">6 STAGES</span>
          </NavLink>

          <NavLink
            to="/resources-staff"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Wrench size={16} />
            <span>Resources & Staff</span>
          </NavLink>

          <NavLink
            to="/cascade-impact"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <GitFork size={16} />
            <span>Cascade Impact</span>
            <span className="nav-badge" style={{ background: '#7c3aed', color: '#fff' }}>GRAPH</span>
          </NavLink>
        </nav>

        <div className="nav-category" style={{ marginTop: '16px' }}>SURVEILLANCE</div>
        <nav className="nav-links">
          <NavLink
            to="/alerts"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Bell size={16} />
            <span>Active Alerts</span>
          </NavLink>

          <NavLink
            to="/sustainability"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Activity size={16} />
            <span>Resource Sustainability</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Live Status */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span
              className="pulse-indicator"
              style={{
                backgroundColor: isPollingActive ? '#10b981' : '#f59e0b',
                boxShadow: isPollingActive ? '0 0 0 3px rgba(16, 185, 129, 0.25)' : 'none',
              }}
            />
            <span>{isPollingActive ? 'Telemetry: Streaming (10s)' : 'Telemetry: Paused'}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
            FlowGuard AI v1.0 · FastApi + SQLite
          </div>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="main-viewport">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-titles">
            <h1>
              {location.pathname === '/' && 'Operations Overview'}
              {location.pathname === '/patient-flow' && 'Patient Flow Pipeline'}
              {location.pathname === '/resources-staff' && 'Resources & Staffing Command'}
              {location.pathname === '/cascade-impact' && 'Cascade Propagation Topology'}
              {location.pathname === '/alerts' && 'Operational Alert Desk'}
              {location.pathname === '/sustainability' && 'Resource Sustainability Radar'}
            </h1>
            <p>Predictive Hospital Bottleneck Intelligence & Continuous Care Coordination</p>
          </div>

          {/* Live Telemetry KPI Ticker in Header */}
          <div className="topbar-actions">
            {/* Live Telemetry Heartbeat Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPollingActive ? '#059669' : '#d97706',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                {isPollingActive ? `Synced ${secondsSinceSync}s ago` : 'Stream Paused'}
              </span>
              <button
                type="button"
                onClick={() => setIsPollingActive(prev => !prev)}
                title={isPollingActive ? 'Pause 10s telemetry polling' : 'Resume telemetry polling'}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                {isPollingActive ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>

            {/* Inbound Ambulances Ticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid #bfdbfe',
              }}
            >
              <Ambulance size={14} />
              <span>{ambulances} Inbound</span>
            </div>

            {/* Total Bed Occupancy Ticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: occupancy >= 90 ? '#fef2f2' : '#f0fdf4',
                color: occupancy >= 90 ? '#dc2626' : '#15803d',
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${occupancy >= 90 ? '#fecaca' : '#bbf7d0'}`,
              }}
            >
              <BedDouble size={14} />
              <span>{occupancy}% Beds Filled</span>
            </div>

            <span className="role-badge">OPERATIONS DIR</span>

            <button className="icon-button" type="button" title="Operator profile">
              <User size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Routed Content */}
        <main className="page-container">
          <Outlet context={{ telemetry }} />
        </main>

        {/* Persistent Compliance Footer */}
        <footer className="app-footer">
          <ShieldAlert size={14} color="#0f766e" />
          <span>
            FlowGuard AI · Operational Intelligence Prototype · Continuous 10s Telemetry Polling Active · Human Clinical Approval Required
          </span>
        </footer>
      </div>
    </div>
  )
}import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  Ambulance,
  BedDouble,
  Bell,
  Eye,
  GitFork,
  LayoutDashboard,
  Pause,
  Play,
  Radio,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from 'lucide-react'

export default function AppShell() {
  const location = useLocation()
  const [telemetry, setTelemetry] = useState(null)
  const [isPollingActive, setIsPollingActive] = useState(true)
  const [secondsSinceSync, setSecondsSinceSync] = useState(0)

  // 10-Second Continuous Polling Cycle
  useEffect(() => {
    let timer = null
    let syncCounter = null

    async function pollLiveTelemetry() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/telemetry/live')
        if (response.ok) {
          const data = await response.json()
          setTelemetry(data)
          setSecondsSinceSync(0)
        }
      } catch (err) {
        console.warn('Telemetry stream offline or polling interrupted:', err)
      }
    }

    if (isPollingActive) {
      pollLiveTelemetry()
      timer = setInterval(pollLiveTelemetry, 10000)

      syncCounter = setInterval(() => {
        setSecondsSinceSync(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
      if (syncCounter) clearInterval(syncCounter)
    }
  }, [isPollingActive])

  const occupancy = telemetry?.live_metrics?.hospital_census?.occupancy_rate_pct ?? 87.6
  const ambulances = telemetry?.live_metrics?.inbound_transfers?.active_ambulances ?? 3

  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <aside className="app-sidebar">
        <div className="brand-section">
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>
          <div className="brand-text">
            <strong>FLOWGUARD AI</strong>
            <span>CLINICAL OPERATIONS</span>
          </div>
        </div>

        <div className="nav-category">CENTRAL COMMAND</div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Operations Overview</span>
          </NavLink>

          <NavLink
            to="/patient-flow"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Patient Flow</span>
            <span className="nav-badge">6 STAGES</span>
          </NavLink>

          <NavLink
            to="/resources-staff"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Wrench size={16} />
            <span>Resources & Staff</span>
          </NavLink>

          <NavLink
            to="/cascade-impact"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <GitFork size={16} />
            <span>Cascade Impact</span>
            <span className="nav-badge" style={{ background: '#7c3aed', color: '#fff' }}>GRAPH</span>
          </NavLink>
        </nav>

        <div className="nav-category" style={{ marginTop: '16px' }}>READ-ONLY TERMINALS[cite: 8, 9, 11, 12]</div>
        <nav className="nav-links">
          <NavLink
            to="/view-panels"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Eye size={16} />
            <span>Department Displays</span>
            <span className="nav-badge" style={{ background: '#0284c7', color: '#fff' }}>LIVE</span>
          </NavLink>
        </nav>

        <div className="nav-category" style={{ marginTop: '16px' }}>SURVEILLANCE & ESG</div>
        <nav className="nav-links">
          <NavLink
            to="/alerts"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Bell size={16} />
            <span>Active Alerts</span>
          </NavLink>

          <NavLink
            to="/sustainability"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Activity size={16} />
            <span>Resource Sustainability</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span
              className="pulse-indicator"
              style={{
                backgroundColor: isPollingActive ? '#10b981' : '#f59e0b',
                boxShadow: isPollingActive ? '0 0 0 3px rgba(16, 185, 129, 0.25)' : 'none',
              }}
            />
            <span>{isPollingActive ? 'Telemetry: Streaming (10s)' : 'Telemetry: Paused'}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
            FlowGuard AI v1.0 · Multi-Terminal Ready
          </div>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="main-viewport">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-titles">
            <h1>
              {location.pathname === '/' && 'Operations Overview'}
              {location.pathname === '/patient-flow' && 'Patient Flow Pipeline'}
              {location.pathname === '/resources-staff' && 'Resources & Staffing Command'}
              {location.pathname === '/cascade-impact' && 'Cascade Propagation Topology'}
              {location.pathname === '/view-panels' && 'Synchronized Department View Panels'}
              {location.pathname === '/alerts' && 'Operational Alert Desk'}
              {location.pathname === '/sustainability' && 'Resource Sustainability Radar'}
            </h1>
            <p>Predictive Hospital Bottleneck Intelligence & Continuous Care Coordination</p>
          </div>

          <div className="topbar-actions">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPollingActive ? '#059669' : '#d97706',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                {isPollingActive ? `Synced ${secondsSinceSync}s ago` : 'Stream Paused'}
              </span>
              <button
                type="button"
                onClick={() => setIsPollingActive(prev => !prev)}
                title={isPollingActive ? 'Pause 10s telemetry polling' : 'Resume telemetry polling'}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                {isPollingActive ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid #bfdbfe',
              }}
            >
              <Ambulance size={14} />
              <span>{ambulances} Inbound</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: occupancy >= 90 ? '#fef2f2' : '#f0fdf4',
                color: occupancy >= 90 ? '#dc2626' : '#15803d',
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${occupancy >= 90 ? '#fecaca' : '#bbf7d0'}`,
              }}
            >
              <BedDouble size={14} />
              <span>{occupancy}% Beds Filled</span>
            </div>

            <span className="role-badge">OPERATIONS DIR</span>

            <button className="icon-button" type="button" title="Operator profile">
              <User size={16} />
            </button>
          </div>
        </header>

        <main className="page-container">
          <Outlet context={{ telemetry }} />
        </main>

        <footer className="app-footer">
          <ShieldAlert size={14} color="#0f766e" />
          <span>
            FlowGuard AI · Operational Intelligence Prototype · Continuous 10s Telemetry Polling Active · Human Clinical Approval Required
          </span>
        </footer>
      </div>
    </div>
  )
}