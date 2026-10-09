import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckSquare,
  ChevronDown,
  Compass,
  FileText,
  GitFork,
  HelpCircle,
  LayoutDashboard,
  Layers,
  MapPin,
  Pause,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

export default function AppShell() {
  const location = useLocation()
  const [telemetry, setTelemetry] = useState(null)
  const [isPollingActive, setIsPollingActive] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 10-Second Telemetry Streaming Loop
  useEffect(() => {
    let timer = null
    async function pollLiveTelemetry() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/telemetry/live')
        if (response.ok) {
          const data = await response.json()
          setTelemetry(data)
        }
      } catch (err) {
        // Fallback gracefully if backend is paused
      }
    }

    if (isPollingActive) {
      pollLiveTelemetry()
      timer = setInterval(pollLiveTelemetry, 10000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPollingActive])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f4f7f6',
        color: '#1e293b',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* LEFT SIDEBAR: Matches CarePulse AI Design System */}
      <aside
        style={{
          width: '260px',
          background: '#0d1f2d',
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid #162a3b',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '20px 20px 14px 20px', borderBottom: '1px solid #162a3b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '15px', color: '#ffffff', letterSpacing: '0.3px', display: 'block' }}>
                CarePulse AI
              </strong>
              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, letterSpacing: '0.8px' }}>
                PREDICT. PREPARE. PROTECT.
              </span>
            </div>
          </div>

          {/* Hospital Network Selector */}
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '0.6px', display: 'block' }}>
              HOSPITAL NETWORK
            </span>
            <div
              style={{
                marginTop: '6px',
                background: '#132838',
                border: '1px solid #1e3a50',
                borderRadius: '6px',
                padding: '8px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block' }}>Hospital network</span>
                <strong>St. Catherine Medical Centre</strong>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>

        {/* Navigation Workspaces */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, letterSpacing: '0.8px', padding: '0 8px' }}>
            WORKSPACE
          </span>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '8px' }}>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <LayoutDashboard size={15} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/resources-staff"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Sliders size={15} />
              <span>Operator Control</span>
            </NavLink>

            <NavLink
              to="/command-centre"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Sparkles size={15} />
              <span>Command Centre</span>
            </NavLink>

            <NavLink
              to="/view-panels"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Building2 size={15} />
              <span>Departments</span>
            </NavLink>

            <NavLink
              to="/predictions"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <TrendingUp size={15} />
              <span>Predictions</span>
            </NavLink>

            <NavLink
              to="/cascade-impact"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <GitFork size={15} />
              <span>Bottleneck Map</span>
            </NavLink>

            <NavLink
              to="/what-if"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Layers size={15} />
              <span>What-If Simulator</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <CheckSquare size={15} />
              <span>Recommendations</span>
            </NavLink>

            <NavLink
              to="/alerts"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={15} />
                <span>Alerts</span>
              </div>
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '999px',
                }}
              >
                3
              </span>
            </NavLink>

            <NavLink
              to="/reports"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <FileText size={15} />
              <span>Reports</span>
            </NavLink>

            {/* Weather / Disaster Emergency Surveillance from Image 2 & 3 */}
            <NavLink
              to="/mumbai-surveillance"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Compass size={15} />
              <span>Mumbai Surveillance</span>
            </NavLink>

            {/* Citizen Nearest Hospital Portal */}
            <NavLink
              to="/find-hospital"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#38bdf8',
              })}
            >
              <MapPin size={15} />
              <span>Find Nearest Hospital</span>
            </NavLink>

            <NavLink
              to="/sustainability"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              })}
            >
              <Activity size={15} />
              <span>Design System</span>
            </NavLink>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#64748b',
                marginTop: '4px',
              }}
            >
              <Settings size={15} />
              <span>Settings</span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: System Status */}
        <div style={{ padding: '16px', borderTop: '1px solid #162a3b', background: '#0a1722', fontSize: '11px' }}>
          <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 800, letterSpacing: '0.8px', display: 'block' }}>
            SYSTEM STATUS
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <strong style={{ color: '#f8fafc', fontSize: '11px' }}>System operational</strong>
          </div>
          <span style={{ color: '#64748b', fontSize: '10px', display: 'block', marginTop: '4px' }}>
            Prototype · Synthetic data
          </span>
          <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>
            Human approval required
          </span>
        </div>
      </aside>

      {/* MAIN VIEWPORT: Search bar header + Page content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header Bar from Screenshot */}
        <header
          style={{
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            gap: '16px',
          }}
        >
          {/* Search Input with ⌘K Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '380px',
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search departments, reports, alerts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12px',
                color: '#1e293b',
                width: '100%',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                color: '#64748b',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              ⌘ K
            </span>
          </div>

          {/* Right Top Status Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Live System Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <div>
                <strong style={{ color: '#0f172a', display: 'block', lineHeight: 1.1 }}>Live system</strong>
                <span style={{ color: '#64748b', fontSize: '10px' }}>Prototype mode</span>
              </div>
            </div>

            {/* Notification Bell Badge */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color="#64748b" />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 900,
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
            </div>

            {/* User Profile Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                HW
              </div>
              <div style={{ fontSize: '11px' }}>
                <strong style={{ color: '#0f172a', display: 'block', lineHeight: 1.1 }}>Hospital Operator</strong>
                <span style={{ color: '#64748b', fontSize: '10px' }}>Operations team</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet context={{ telemetry }} />
        </main>
      </div>
    </div>
  )
}