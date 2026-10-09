import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Wrench,
  Activity,
  Bell,
  ShieldCheck,
} from 'lucide-react'

const routeTitles = {
  '/': {
    title: 'Operations Overview',
    subtitle: 'Hospital capacity and predictive bottleneck radar',
  },
  '/patient-flow': {
    title: 'Patient Flow Pipeline',
    subtitle: 'Real-time progression through 6 operational stages',
  },
  '/resources-staff': {
    title: 'Resources & Staffing',
    subtitle: 'Bed allocation, critical diagnostic scanners, and workforce',
  },
  '/cascade-impact': {
    title: 'Cascade Impact Graph',
    subtitle: 'Cross-departmental delay propagation and risk transmission',
  },
  '/alerts': {
    title: 'Early Warning Alerts',
    subtitle: 'Active bottlenecks requiring clinical management intervention',
  },
  '/sustainability': {
    title: 'Sustainability & Resilience',
    subtitle: 'Operational environmental footprint and UN SDG impact',
  },
}

export default function AppShell() {
  const location = useLocation()
  const currentMeta = routeTitles[location.pathname] || {
    title: 'FlowGuard AI',
    subtitle: 'Predictive Hospital Bottleneck Intelligence',
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="brand-section">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <div className="brand-text">
            <strong>FLOWGUARD AI</strong>
            <span>PREDICT · EXPLAIN · PREVENT</span>
          </div>
        </div>

        <div className="nav-category">WORKSPACE</div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Operations Overview</span>
          </NavLink>

          <NavLink
            to="/patient-flow"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Patient Flow</span>
          </NavLink>

          <NavLink
            to="/resources-staff"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Wrench size={18} />
            <span>Resources & Staff</span>
          </NavLink>

          <NavLink
            to="/cascade-impact"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Activity size={18} />
            <span>Cascade Impact</span>
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Bell size={18} />
            <span>Alerts</span>
            <span className="nav-badge">2</span>
          </NavLink>

          <NavLink
            to="/sustainability"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={18} />
            <span>Sustainability</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <div className="pulse-indicator" />
            <span>Live Telemetry Connected</span>
          </div>
        </div>
      </aside>

      <div className="main-viewport">
        <header className="app-topbar">
          <div className="topbar-titles">
            <h1>{currentMeta.title}</h1>
            <p>{currentMeta.subtitle}</p>
          </div>

          <div className="topbar-actions">
            <div className="live-chip">
              <span className="pulse-indicator" />
              <span>Simulated live · updated 10s ago</span>
            </div>
            <div className="role-badge">Admin · Ops</div>
            <button className="icon-button" aria-label="Notifications" type="button">
              <Bell size={18} />
              <span className="badge-dot" />
            </button>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>

        <footer className="app-footer">
          <ShieldCheck size={14} />
          <span>FlowGuard AI · Prototype · Synthetic data · Human approval required</span>
        </footer>
      </div>
    </div>
  )
}