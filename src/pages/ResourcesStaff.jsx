import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BedDouble,
  CheckCircle2,
  Clock,
  Cpu,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  UserCheck,
  UserX,
  Users,
  Wrench,
} from 'lucide-react'

// Bed capacity configuration
const INITIAL_BED_UNITS = [
  {
    id: 'unit-icu',
    name: 'Intensive Care Unit (ICU)',
    occupied: 18,
    total: 20,
    acuity: 'Critical',
    nurseRatio: '1:1.2',
    targetRatio: '1:1.0',
  },
  {
    id: 'unit-ed',
    name: 'Emergency Observation Bays',
    occupied: 28,
    total: 30,
    acuity: 'Urgent',
    nurseRatio: '1:3.8',
    targetRatio: '1:3.0',
  },
  {
    id: 'unit-med',
    name: 'General Medicine Ward',
    occupied: 72,
    total: 80,
    acuity: 'Moderate',
    nurseRatio: '1:5.1',
    targetRatio: '1:4.0',
  },
  {
    id: 'unit-surg',
    name: 'Surgical Step-Down Ward',
    occupied: 31,
    total: 40,
    acuity: 'Moderate',
    nurseRatio: '1:4.0',
    targetRatio: '1:4.0',
  },
]

// Diagnostic imaging & critical biomedical equipment
const INITIAL_EQUIPMENT = [
  {
    id: 'eq-ct-1',
    name: 'CT Scanner 01 (Emergency)',
    type: 'Diagnostic Imaging',
    isOnline: true,
    utilization: 94,
    queue: 12,
    maintenanceDue: 'In 18 days',
  },
  {
    id: 'eq-ct-2',
    name: 'CT Scanner 02 (Inpatient)',
    type: 'Diagnostic Imaging',
    isOnline: true,
    utilization: 78,
    queue: 6,
    maintenanceDue: 'In 4 days',
  },
  {
    id: 'eq-mri',
    name: '3T MRI Unit',
    type: 'Diagnostic Imaging',
    isOnline: true,
    utilization: 82,
    queue: 8,
    maintenanceDue: 'In 32 days',
  },
  {
    id: 'eq-vents',
    name: 'ICU Mechanical Ventilators',
    type: 'Life Support',
    isOnline: true,
    utilization: 85,
    queue: 2,
    maintenanceDue: 'Fleet calibrated',
  },
]

// Department staffing by shift
const SHIFT_SCHEDULES = {
  Morning: [
    { department: 'Emergency Care', doctors: 4, nurses: 12, targetNurses: 12 },
    { department: 'Intensive Care (ICU)', doctors: 3, nurses: 10, targetNurses: 10 },
    { department: 'Radiology / Imaging', doctors: 2, nurses: 4, targetNurses: 4 },
    { department: 'Pathology Lab', doctors: 1, nurses: 6, targetNurses: 6 },
    { department: 'Inpatient Pharmacy', doctors: 1, nurses: 5, targetNurses: 5 },
  ],
  Afternoon: [
    { department: 'Emergency Care', doctors: 4, nurses: 11, targetNurses: 12 },
    { department: 'Intensive Care (ICU)', doctors: 2, nurses: 9, targetNurses: 10 },
    { department: 'Radiology / Imaging', doctors: 1, nurses: 3, targetNurses: 4 },
    { department: 'Pathology Lab', doctors: 1, nurses: 5, targetNurses: 6 },
    { department: 'Inpatient Pharmacy', doctors: 1, nurses: 4, targetNurses: 5 },
  ],
  Night: [
    { department: 'Emergency Care', doctors: 2, nurses: 8, targetNurses: 9 },
    { department: 'Intensive Care (ICU)', doctors: 2, nurses: 7, targetNurses: 8 },
    { department: 'Radiology / Imaging', doctors: 1, nurses: 2, targetNurses: 2 },
    { department: 'Pathology Lab', doctors: 0, nurses: 3, targetNurses: 3 },
    { department: 'Inpatient Pharmacy', doctors: 0, nurses: 2, targetNurses: 3 },
  ],
}

export default function ResourcesStaff() {
  const [bedUnits] = useState(INITIAL_BED_UNITS)
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT)
  const [currentShift, setCurrentShift] = useState('Morning')
  const [staffShortageSimulated, setStaffShortageSimulated] = useState(false)

  // Interactive toggle: take equipment offline to demonstrate live bottleneck reaction
  function toggleEquipmentStatus(id) {
    setEquipment(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isOnline
          return {
            ...item,
            isOnline: nextState,
            utilization: nextState ? 80 : 0,
            queue: nextState ? Math.max(2, item.queue - 8) : item.queue + 10,
          }
        }
        return item
      })
    )
  }

  // Calculate overall metrics
  const totalBeds = bedUnits.reduce((acc, u) => acc + u.total, 0)
  const occupiedBeds = bedUnits.reduce((acc, u) => acc + u.occupied, 0)
  const overallOccupancyPct = Math.round((occupiedBeds / totalBeds) * 100)

  const activeEquipmentCount = equipment.filter(e => e.isOnline).length
  const totalEquipmentCount = equipment.length

  const activeStaffList = SHIFT_SCHEDULES[currentShift].map(dept => ({
    ...dept,
    nurses: staffShortageSimulated ? Math.max(1, dept.nurses - 1) : dept.nurses,
  }))

  const totalDoctors = activeStaffList.reduce((acc, d) => acc + d.doctors, 0)
  const totalNurses = activeStaffList.reduce((acc, d) => acc + d.nurses, 0)

  // Flag if any critical scanner is offline
  const offlineScanners = equipment.filter(e => !e.isOnline)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Bed Occupancy</span>
            <BedDouble size={18} color="#0f766e" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {overallOccupancyPct}%
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {occupiedBeds} of {totalBeds} total beds occupied
          </span>
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              background: '#f1f5f9',
              marginTop: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${overallOccupancyPct}%`,
                background: overallOccupancyPct >= 85 ? '#ea580c' : '#0f766e',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Diagnostic Asset Uptime</span>
            <Cpu size={18} color="#1d4ed8" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {activeEquipmentCount} / {totalEquipmentCount} Active
          </div>
          <span style={{ fontSize: '11px', color: offlineScanners.length > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
            {offlineScanners.length > 0
              ? `${offlineScanners.length} asset in offline maintenance`
              : 'All critical imaging units operational'}
          </span>
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              background: '#f1f5f9',
              marginTop: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(activeEquipmentCount / totalEquipmentCount) * 100}%`,
                background: offlineScanners.length > 0 ? '#dc2626' : '#1d4ed8',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Active Shift Roster</span>
            <Users size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {totalDoctors + totalNurses} on Duty
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {totalDoctors} physicians · {totalNurses} nursing staff
          </span>
          <div style={{ fontSize: '10px', color: staffShortageSimulated ? '#ea580c' : '#16a34a', fontWeight: 700, marginTop: '8px' }}>
            {staffShortageSimulated ? 'Staff shortage scenario active (-1/dept)' : 'Full shift roster present'}
          </div>
        </div>
      </div>

      {/* Row 1: Hospital Bed Allocation Matrix */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>Inpatient Bed Allocation & Unit Acuity</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Bed occupancy across high-intensity and general clinical departments
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#ecfdf5',
              color: '#059669',
            }}
          >
            REAL-TIME OCCUPANCY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {bedUnits.map(unit => {
            const pct = Math.round((unit.occupied / unit.total) * 100)
            const isHigh = pct >= 90
            const isWarning = pct >= 80

            return (
              <div
                key={unit.id}
                style={{
                  background: '#f8fafc',
                  border: `1px solid ${isHigh ? '#fecaca' : isWarning ? '#fed7aa' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{unit.name}</div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isHigh ? '#fef2f2' : isWarning ? '#fff7ed' : '#ecfdf5',
                      color: isHigh ? '#dc2626' : isWarning ? '#ea580c' : '#059669',
                    }}
                  >
                    {pct}% FULL
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Occupancy</span>
                  <strong style={{ fontSize: '16px', color: '#0f172a' }}>
                    {unit.occupied} <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>/ {unit.total} beds</span>
                  </strong>
                </div>

                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    background: '#e2e8f0',
                    margin: '8px 0 12px 0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isHigh ? '#dc2626' : isWarning ? '#ea580c' : '#0f766e',
                      borderRadius: '999px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>Staffing ratio:</span>
                  <strong style={{ color: unit.nurseRatio > unit.targetRatio ? '#ea580c' : '#334155' }}>
                    {unit.nurseRatio} ({unit.targetRatio} standard)
                  </strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 2: Critical Equipment & Maintenance Toggles */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>
              Diagnostic Imaging Units & Biomedical Equipment
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Interactive equipment availability: Toggle status to simulate bottleneck cascade
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Click button to simulate outage</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {equipment.map(item => (
            <div
              key={item.id}
              style={{
                border: `1px solid ${item.isOnline ? '#e2e8f0' : '#fca5a5'}`,
                background: item.isOnline ? '#ffffff' : '#fff5f5',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.name}</strong>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{item.type}</div>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 7px',
                      borderRadius: '4px',
                      background: item.isOnline ? '#ecfdf5' : '#fef2f2',
                      color: item.isOnline ? '#059669' : '#dc2626',
                    }}
                  >
                    {item.isOnline ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {item.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0 6px 0' }}>
                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>UTILIZATION</span>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      {item.isOnline ? `${item.utilization}%` : '0% (Offline)'}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>PENDING SCANS</span>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: item.queue > 8 ? '#dc2626' : '#0f172a',
                      }}
                    >
                      {item.queue} orders
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Maintenance: {item.maintenanceDue}</span>
              </div>

              <button
                type="button"
                onClick={() => toggleEquipmentStatus(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: item.isOnline ? '#cbd5e1' : '#dc2626',
                  background: item.isOnline ? '#ffffff' : '#dc2626',
                  color: item.isOnline ? '#334155' : '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Wrench size={13} />
                {item.isOnline ? 'Simulate Outage / Service' : 'Restore Asset to Service'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Staffing Shift Inspector & Absenteeism Simulation */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#0f172a' }}>Clinical Shift Roster & Staff Coverage</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Physician and nursing staff deployment across clinical care areas
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Shift Selector */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['Morning', 'Afternoon', 'Night'].map(shift => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => setCurrentShift(shift)}
                  style={{
                    border: 'none',
                    background: currentShift === shift ? '#ffffff' : 'transparent',
                    color: currentShift === shift ? '#0f766e' : '#64748b',
                    fontWeight: currentShift === shift ? 700 : 500,
                    fontSize: '11px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: currentShift === shift ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  {shift} Shift
                </button>
              ))}
            </div>

            {/* Shortage Toggle */}
            <button
              type="button"
              onClick={() => setStaffShortageSimulated(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: staffShortageSimulated ? '#ea580c' : '#cbd5e1',
                background: staffShortageSimulated ? '#fff7ed' : '#ffffff',
                color: staffShortageSimulated ? '#ea580c' : '#475569',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {staffShortageSimulated ? <UserX size={13} /> : <UserCheck size={13} />}
              {staffShortageSimulated ? 'Shortage Active (-1/dept)' : 'Simulate Call-Outs'}
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '10px 12px' }}>Clinical Department</th>
                <th style={{ padding: '10px 12px' }}>Attending Doctors</th>
                <th style={{ padding: '10px 12px' }}>Staff Nurses on Duty</th>
                <th style={{ padding: '10px 12px' }}>Coverage Status</th>
              </tr>
            </thead>
            <tbody>
              {activeStaffList.map((row, idx) => {
                const hasDeficit = row.nurses < row.targetNurses
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{row.department}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{row.doctors} physicians</td>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: hasDeficit ? '#ea580c' : '#0f172a' }}>{row.nurses}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}> / {row.targetNurses} target</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          background: hasDeficit ? '#fff7ed' : '#ecfdf5',
                          color: hasDeficit ? '#ea580c' : '#059669',
                        }}
                      >
                        {hasDeficit ? 'DEFICIT (-1)' : 'FULL COVERAGE'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested Clinical Actions */}
      {(offlineScanners.length > 0 || staffShortageSimulated) && (
        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <ShieldAlert size={20} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '13px', color: '#9a3412', display: 'block' }}>
              Resource Bottleneck Interventions Required
            </strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#9a3412', lineHeight: 1.5 }}>
              {offlineScanners.length > 0 && (
                <li>
                  {offlineScanners.map(s => s.name).join(', ')} offline: Divert non-critical elective scans and notify ED triage of delayed turnaround.
                </li>
              )}
              {staffShortageSimulated && (
                <li>
                  Active nursing deficit detected across shifts: Contact on-call float pool coordinator to authorize overtime coverage.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}