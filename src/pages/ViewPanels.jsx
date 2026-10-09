import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Radio,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'

const DEPARTMENT_CONFIGS = {
  radiology: {
    name: 'Radiology & Imaging',
    code: 'RAD-01',
    type: 'Diagnostic Service',
    nominalCapacity: '30 scans/hr',
    activeEquipment: '1 of 2 CT Scanners operational (CT-2 in service)',
    currentQueue: 28,
    timeToBreach: '~4 hours',
    riskScore: 82,
    severityTier: 'CRITICAL',
    drivers: [
      { label: 'ED trauma intake surge', share: '45%' },
      { label: 'CT Scanner 02 unscheduled maintenance', share: '35%' },
      { label: 'Staffing deficit (-2 technicians)', share: '20%' },
    ],
    approvedDirectives: [
      { id: 'dir-1', time: '14:10', text: 'Re-route 15 non-urgent outpatient CT scans to evening cohort.', origin: 'Central Command' },
      { id: 'dir-2', time: '14:25', text: 'Float technician redeployed from Outpatient Clinic to Emergency CT-01.', origin: 'Staffing Desk' },
      { id: 'dir-3', time: '14:40', text: 'Priority trauma protocol active: reserve bay 1 for inbound critical arrivals.', origin: 'Clinical Director' },
    ],
  },
  emergency: {
    name: 'Emergency Department (ED)',
    code: 'ED-MAIN',
    type: 'Acute Intake & Resuscitation',
    nominalCapacity: '38 patients/hr',
    activeEquipment: 'All 30 resus & observation bays staffed',
    currentQueue: 34,
    timeToBreach: '~2h 15m',
    riskScore: 74,
    severityTier: 'WARNING',
    drivers: [
      { label: 'Respiratory walk-in surge', share: '50%' },
      { label: 'Inpatient bed allocation hold', share: '30%' },
      { label: 'Diagnostic imaging wait times', share: '20%' },
    ],
    approvedDirectives: [
      { id: 'dir-4', time: '13:50', text: 'Activate Fast-Track lane for ambulatory ESI 4 & 5 arrivals.', origin: 'Central Command' },
      { id: 'dir-5', time: '14:15', text: 'Ambulance triage bypass: route category 2 directly to step-down assessment.', origin: 'ED Charge Nurse' },
    ],
  },
  pathology: {
    name: 'Pathology & Stat Lab',
    code: 'LAB-02',
    type: 'Diagnostic Laboratory',
    nominalCapacity: '28 panels/hr',
    activeEquipment: 'Dual automated hematology analyzers online',
    currentQueue: 19,
    timeToBreach: '>8h (Stable)',
    riskScore: 42,
    severityTier: 'WATCH',
    drivers: [
      { label: 'Routine inpatient panels', share: '60%' },
      { label: 'Stat blood gas requests', share: '40%' },
    ],
    approvedDirectives: [
      { id: 'dir-6', time: '12:00', text: 'Standard shift rotation maintained. Priority bench dedicated to ED stat bloods.', origin: 'Lab Supervisor' },
    ],
  },
  icu: {
    name: 'Intensive Care (ICU) & Wards',
    code: 'ICU-WARD',
    type: 'Inpatient Bed Operations',
    nominalCapacity: '20 monitored beds',
    activeEquipment: '18 of 20 beds occupied (90% capacity)',
    currentQueue: 16,
    timeToBreach: '~3 hours',
    riskScore: 78,
    severityTier: 'WARNING',
    drivers: [
      { label: 'Delayed morning discharges on general floor', share: '55%' },
      { label: 'ED post-resuscitation hold requests', share: '45%' },
    ],
    approvedDirectives: [
      { id: 'dir-7', time: '14:00', text: 'Expedite linen turnover for beds 12-16 on Medical Floor 3.', origin: 'Central Command' },
      { id: 'dir-8', time: '14:30', text: 'Step-down transfer review initiated for 3 recovering patients in ICU Bay 2.', origin: 'ICU Intensivist' },
    ],
  },
}

export default function ViewPanels() {
  const [selectedDeptKey, setSelectedDeptKey] = useState('radiology')
  const [isKioskMode, setIsKioskMode] = useState(false)
  const [clockTime, setClockTime] = useState(new Date().toLocaleTimeString())
  const { telemetry } = useOutletContext() || {}

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const current = DEPARTMENT_CONFIGS[selectedDeptKey]
  const isCritical = current.severityTier === 'CRITICAL'
  const isWarning = current.severityTier === 'WARNING'

  const tierBg = isCritical ? '#fef2f2' : isWarning ? '#fff7ed' : '#ecfdf5'
  const tierBorder = isCritical ? '#fecaca' : isWarning ? '#fed7aa' : '#a7f3d0'
  const tierColor = isCritical ? '#dc2626' : isWarning ? '#ea580c' : '#059669'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: isKioskMode ? '100%' : '1400px',
        margin: '0 auto',
      }}
    >
      {/* Read-Only Top Status Banner */}
      <div
        style={{
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.8px',
            }}
          >
            <Lock size={12} />
            READ-ONLY VIEW PANEL
          </span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Synchronized terminal · Changes are authorized exclusively via Central Control Panel
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38bdf8' }}>
            <Radio size={14} className="pulse-indicator" />
            <span>SYNC CYCLE: 10s STREAMING</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
            {clockTime}
          </span>
          <button
            type="button"
            onClick={() => setIsKioskMode(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isKioskMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            {isKioskMode ? 'Exit Wall Mode' : 'Wall Monitor Mode'}
          </button>
        </div>
      </div>

      {/* Department Channel Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(DEPARTMENT_CONFIGS).map(([key, dept]) => {
          const isSelected = selectedDeptKey === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDeptKey(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isSelected ? '#0f766e' : '#e2e8f0',
                background: isSelected ? '#0f766e' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 6px rgba(15,118,110,0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Eye size={14} />
              <span>{dept.name}</span>
              <span
                style={{
                  fontSize: '9px',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: isSelected ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#64748b',
                }}
              >
                {dept.code}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Wall-Board Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Breach Timing & Severity */}
        <div
          style={{
            background: tierBg,
            border: `2px solid ${tierBorder}`,
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: tierColor, letterSpacing: '1px' }}>
                SEVERITY TIER[cite: 9, 12]
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: tierColor,
                  color: '#ffffff',
                }}
              >
                {current.severityTier}
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '10px 0 2px 0' }}>
              {current.timeToBreach}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Estimated time to capacity breach</span>
          </div>

          <div style={{ borderTop: `1px solid ${tierBorder}`, paddingTop: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#475569' }}>Calculated Risk Score:</span>
              <strong style={{ color: tierColor }}>{current.riskScore}%</strong>
            </div>
            <div style={{ height: '6px', background: '#ffffff', borderRadius: '999px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${current.riskScore}%`, height: '100%', background: tierColor }} />
            </div>
          </div>
        </div>

        {/* Card 2: Live Queue vs Capacity */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>ACTIVE WORKLOAD</span>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '10px 0 2px 0' }}>
              {current.currentQueue}{' '}
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>orders / patients</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Rated nominal throughput: {current.nominalCapacity}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>EQUIPMENT & BAY HEALTH</span>
            <strong style={{ fontSize: '12px', color: '#0f172a' }}>{current.activeEquipment}</strong>
          </div>
        </div>

        {/* Card 3: Root-Cause Driver Breakdown */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>WHY: DRIVER SHARE[cite: 9, 12]</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {current.drivers.map((drv, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '3px' }}>
                  <span>{drv.label}</span>
                  <strong>{drv.share}</strong>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: drv.share,
                      height: '100%',
                      background: idx === 0 ? '#2563eb' : idx === 1 ? '#ea580c' : '#0f766e',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '12px' }}>
            Attribution of overload based on queue-drift model
          </span>
        </div>
      </div>

      {/* Lower Section: Incoming Directives from Central Command */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>
              Approved Directives & Preventive Actions Bulletin
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Broadcast from Central Control Panel · Read-only operational instructions for clinical staff[cite: 8, 9, 11, 12]
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#ecfdf5',
              color: '#059669',
            }}
          >
            DISPATCH ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {current.approvedDirectives.map(dir => (
            <div
              key={dir.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ccfbf1',
                  color: '#0f766e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{dir.text}</div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  Origin: <strong>{dir.origin}</strong> · Broadcast at {dir.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}