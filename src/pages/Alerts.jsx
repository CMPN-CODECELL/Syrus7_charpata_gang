import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

// POC Page 3: Exact 6-Stage Prediction Decision Flow Steps
const DECISION_STAGES = [
  { id: 1, name: 'Validate', check: 'Valid input from authorised role?', status: 'pass', rule: 'Reject V01 if unauthorised' },
  { id: 2, name: 'Fuse Demand', check: 'Season & weather factors available?', status: 'pass', rule: 'Fallback to last-known multiplier if stale' },
  { id: 3, name: 'Forecast', check: 'P90 load ≥ 0.85 within next 12h?', status: 'pass', rule: 'Green: keep monitoring if below 0.85' },
  { id: 4, name: 'Score', check: 'Confidence ≥ 60% for timing & severity?', status: 'pass', rule: 'Advisory band only if low confidence' },
  { id: 5, name: 'Cascade', check: 'Downstream impact above threshold?', status: 'pass', rule: 'Local alert only if contained' },
  { id: 6, name: 'Decide', check: 'Operator approves recommended action?', status: 'action_required', rule: 'Hold & escalate if unacknowledged in 15m' },
]

// POC Page 3: Active Alerts filtered by exact severity tiers
const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    tier: 'CRITICAL',
    tierCondition: 'Load ≥ 1.15 or breach ≤ 2h',
    department: 'Radiology (CT-01)',
    message: 'Demand at 1.17x capacity. Breach predicted at T+4h.',
    drivers: 'Arrivals +40%, CT-2 down, 2 techs short',
    suggestedAction: 'Add 1 tech (+4/h) + Reroute 15 outpatient scans',
    timestamp: '14:32:10',
    status: 'pending_approval',
  },
  {
    id: 'ALT-102',
    tier: 'WARNING',
    tierCondition: 'P50 load ≥ 1.0 within 6h',
    department: 'Emergency Department',
    message: 'Triage queue saturation approaching capacity threshold.',
    drivers: 'Respiratory seasonal surge (+35%)',
    suggestedAction: 'Activate Fast-Track bay for ESI-4/5 walk-ins',
    timestamp: '14:28:45',
    status: 'pending_approval',
  },
  {
    id: 'ALT-103',
    tier: 'WATCH',
    tierCondition: 'P90 load ≥ 0.85 within next 12h',
    department: 'Intensive Care (ICU)',
    message: 'Bed occupancy at 90% (18/20 beds occupied).',
    drivers: 'Delayed step-down ward discharge turnover',
    suggestedAction: 'Review 3 recovering patients for floor transfer',
    timestamp: '14:15:00',
    status: 'approved',
  },
]

// POC Page 3: Append-Only Audit Trail (Cycle n-1 -> Cycle n -> Cycle n+1)
const INITIAL_AUDIT_TRAIL = [
  {
    cycle: 'Cycle n-2',
    timestamp: '13:30:14',
    operator: 'Dr. R. Sharma (Ops Dir)',
    action: 'Approved PACU overflow bed activation',
    why: 'ICU occupancy reached 90%',
    forecastVersion: 'v1.0.4 (SMA-3 + Seasonal)',
    decision: 'APPROVED',
  },
  {
    cycle: 'Cycle n-1',
    timestamp: '14:00:22',
    operator: 'M. Patel (Duty Nurse Mgr)',
    action: 'Approved float technician redeployment',
    why: 'Radiology CT-01 wait times exceeded 45m',
    forecastVersion: 'v1.0.4 (SMA-3 + Seasonal)',
    decision: 'APPROVED',
  },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [auditTrail, setAuditTrail] = useState(INITIAL_AUDIT_TRAIL)
  const [activeCycleNumber, setActiveCycleNumber] = useState(0)

  // POC Page 3: Human Action Approval (Cycle n + Decision -> Next Cycle)
  function handleApprove(alert) {
    const nextCycleLabel = `Cycle n+${activeCycleNumber}`
    setActiveCycleNumber(prev => prev + 1)

    // Add entry to immutable audit trail
    const newAuditEntry = {
      cycle: nextCycleLabel,
      timestamp: new Date().toLocaleTimeString(),
      operator: 'Authorized Operator (Active Session)',
      action: alert.suggestedAction,
      why: `${alert.department}: ${alert.drivers}`,
      forecastVersion: 'v1.0.4 (Empirical SMA-3)',
      decision: 'APPROVED & LOGGED',
    }

    setAuditTrail(prev => [newAuditEntry, ...prev])

    // Update alert status
    setAlerts(prev =>
      prev.map(a => (a.id === alert.id ? { ...a, status: 'approved' } : a))
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner: POC Page 3 Rule Statement */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#0f172a',
              color: '#ffffff',
              letterSpacing: '1px',
            }}
          >
            POC PAGE 3 GOVERNANCE
          </span>
          <h2 style={{ fontSize: '18px', color: '#0f172a', margin: '6px 0 2px 0' }}>
            Prediction Decision Flow & Human Audit Trail
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Every cycle ends in a human decision and an append-only audit record. Operators approve every action.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            CRITICAL: Load ≥ 1.15
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
            WARNING: P50 ≥ 1.0
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
            WATCH: P90 ≥ 0.85
          </span>
        </div>
      </div>

      {/* SECTION 1: 6-Stage Prediction Decision Flow (POC Page 3 Top Pipeline) */}
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
          <h3 style={{ fontSize: '14px', margin: 0, color: '#0f172a' }}>
            Prediction Decision Flow (Update Cycle Pipeline)
          </h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Trigger: Operator update, 60s timer, or new telemetry signal
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
          }}
        >
          {DECISION_STAGES.map(stage => (
            <div
              key={stage.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: stage.status === 'pass' ? '#0f766e' : '#ea580c',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stage.id}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 800, color: stage.status === 'pass' ? '#059669' : '#ea580c' }}>
                  {stage.status === 'pass' ? 'VALID' : 'DECISION POINT'}
                </span>
              </div>
              <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>{stage.name}</strong>
              <div style={{ fontSize: '10px', color: '#475569', margin: '4px 0' }}>{stage.check}</div>
              <div style={{ fontSize: '9px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '6px' }}>
                {stage.rule}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Active Alerts Tiered by POC Severity Definitions */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ fontSize: '14px', margin: '0 0 14px 0', color: '#0f172a' }}>
          Active Operational Risks (Tiered Early Warnings)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map(alert => {
            const isCrit = alert.tier === 'CRITICAL'
            const isWarn = alert.tier === 'WARNING'
            const tierColor = isCrit ? '#dc2626' : isWarn ? '#ea580c' : '#059669'
            const tierBg = isCrit ? '#fef2f2' : isWarn ? '#fff7ed' : '#ecfdf5'

            return (
              <div
                key={alert.id}
                style={{
                  border: `1px solid ${tierColor}40`,
                  background: tierBg,
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        background: tierColor,
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {alert.tier}
                    </span>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{alert.department}</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>({alert.tierCondition})</span>
                  </div>

                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                    {alert.message}
                  </p>

                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    <strong>Why (Drivers):</strong> {alert.drivers}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0f766e', marginTop: '2px' }}>
                    <strong>Recommended Action:</strong> {alert.suggestedAction}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Detected at {alert.timestamp}</span>
                  {alert.status === 'pending_approval' ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(alert)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#0f766e',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <UserCheck size={14} />
                      Approve & Log Action
                    </button>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={13} /> Approved in Audit Trail
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 3: The Append-Only Audit Trail (POC Page 3 Bottom Table) */}
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
            <h3 style={{ fontSize: '14px', margin: 0, color: '#0f172a' }}>
              Append-Only Audit Trail (Cycle n-1 → Cycle n → Cycle n+1)
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Immutable record: Who, what, when, why, forecast version and decision
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#f1f5f9',
              color: '#334155',
            }}
          >
            IMMUTABLE LOG
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '8px 10px' }}>Cycle</th>
                <th style={{ padding: '8px 10px' }}>Timestamp</th>
                <th style={{ padding: '8px 10px' }}>Operator (Who)</th>
                <th style={{ padding: '8px 10px' }}>Action Approved (What)</th>
                <th style={{ padding: '8px 10px' }}>Clinical Driver (Why)</th>
                <th style={{ padding: '8px 10px' }}>Model Version</th>
                <th style={{ padding: '8px 10px' }}>Decision</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#0f766e' }}>{row.cycle}</td>
                  <td style={{ padding: '10px', color: '#64748b' }}>{row.timestamp}</td>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#0f172a' }}>{row.operator}</td>
                  <td style={{ padding: '10px', color: '#1e293b' }}>{row.action}</td>
                  <td style={{ padding: '10px', color: '#64748b' }}>{row.why}</td>
                  <td style={{ padding: '10px', color: '#64748b', fontFamily: 'monospace' }}>{row.forecastVersion}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '9px',
                      }}
                    >
                      {row.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}