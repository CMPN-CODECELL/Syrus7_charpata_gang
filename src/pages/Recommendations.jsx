import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'

const INITIAL_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    priority: 'P1 · Act now',
    priorityLevel: 'p1',
    title: 'Review flex-bed availability in Ward B',
    subtitle: 'Requires authorized staff review',
    department: 'Emergency',
    impact: 'May reduce boarding pressure',
  },
  {
    id: 'rec-2',
    priority: 'P2 · High',
    priorityLevel: 'p2',
    title: 'Review non-urgent scan scheduling',
    subtitle: 'Requires authorized staff review',
    department: 'Radiology',
    impact: 'May shorten queue',
  },
  {
    id: 'rec-3',
    priority: 'P3 · Plan',
    priorityLevel: 'p3',
    title: 'Review discharge huddle timing',
    subtitle: 'Requires authorized staff review',
    department: 'Discharge',
    impact: 'Could free suitable beds sooner',
  },
  {
    id: 'rec-4',
    priority: 'P4 · Monitor',
    priorityLevel: 'p4',
    title: 'Check pharmacy support coverage',
    subtitle: 'Requires authorized staff review',
    department: 'Pharmacy',
    impact: 'May improve turnaround',
  },
]

const INITIAL_AUDIT_LOG = [
  {
    id: 'log-1',
    operator: 'HW',
    actionText: 'Operator reviewed synthetic forecast',
    timestamp: 'Today · Prototype event',
    status: 'Logged',
  },
]

export default function Recommendations() {
  const [selectedDept, setSelectedDept] = useState('All')
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS)
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG)
  const [reviewingItem, setReviewingItem] = useState(null)

  const filteredItems = recommendations.filter(item => {
    if (selectedDept === 'All') return true
    return item.department === selectedDept
  })

  function handleApprove(item) {
    const newLog = {
      id: `log-${Date.now()}`,
      operator: 'HW',
      actionText: `Operator approved: "${item.title}"`,
      timestamp: `Today, ${new Date().toLocaleTimeString()}`,
      status: 'Approved',
    }
    setAuditLog(prev => [newLog, ...prev])
    setRecommendations(prev => prev.filter(r => r.id !== item.id))
    setReviewingItem(null)
  }

  function handleDismiss(item) {
    const newLog = {
      id: `log-${Date.now()}`,
      operator: 'HW',
      actionText: `Operator dismissed: "${item.title}"`,
      timestamp: `Today, ${new Date().toLocaleTimeString()}`,
      status: 'Dismissed',
    }
    setAuditLog(prev => [newLog, ...prev])
    setRecommendations(prev => prev.filter(r => r.id !== item.id))
    setReviewingItem(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>ACTION WORKSPACE</span>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>Recommendations</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Review suggested operational actions; approval stays with authorized staff.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['All', 'Emergency', 'Radiology', 'Discharge'].map(dept => (
          <button
            key={dept}
            type="button"
            onClick={() => setSelectedDept(dept)}
            style={{
              border: 'none',
              background: selectedDept === dept ? '#0f172a' : '#ffffff',
              color: selectedDept === dept ? '#ffffff' : '#475569',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #e2e8f0',
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Priority Recommendations Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
              <th style={{ padding: '14px 18px', width: '140px' }}>PRIORITY</th>
              <th style={{ padding: '14px 18px' }}>RECOMMENDED ACTION</th>
              <th style={{ padding: '14px 18px', width: '140px' }}>DEPARTMENT</th>
              <th style={{ padding: '14px 18px', width: '220px' }}>ILLUSTRATIVE IMPACT</th>
              <th style={{ padding: '14px 18px', width: '130px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No pending recommendations in this department.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const isP1 = item.priorityLevel === 'p1'
                const isP2 = item.priorityLevel === 'p2'
                const isP3 = item.priorityLevel === 'p3'

                const badgeBg = isP1 ? '#fef2f2' : isP2 ? '#fff7ed' : isP3 ? '#fefce8' : '#f0fdfa'
                const badgeColor = isP1 ? '#dc2626' : isP2 ? '#ea580c' : isP3 ? '#ca8a04' : '#0f766e'

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: badgeBg,
                          color: badgeColor,
                        }}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>{item.title}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{item.subtitle}</span>
                    </td>
                    <td style={{ padding: '16px 18px', color: '#334155', fontWeight: 600 }}>{item.department}</td>
                    <td style={{ padding: '16px 18px', color: '#64748b' }}>{item.impact}</td>
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setReviewingItem(item)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#0f766e',
                            cursor: 'pointer',
                          }}
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDismiss(item)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal Dialog */}
      {reviewingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '12px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e' }}>DECISION REVIEW</span>
              <button type="button" onClick={() => setReviewingItem(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{reviewingItem.title}</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
              Department: <strong>{reviewingItem.department}</strong> · Expected Outcome: {reviewingItem.impact}
            </p>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569', marginBottom: '20px' }}>
              Approval will update real-time bed allocations and broadcast directives to departmental screens.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDismiss(reviewingItem)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
              >
                Reject Action
              </button>
              <button
                type="button"
                onClick={() => handleApprove(reviewingItem)}
                style={{ background: '#0f766e', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Section */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>Audit log</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Recent demo decisions and system events</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {auditLog.map(log => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  {log.operator}
                </div>
                <div>
                  <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>{log.actionText}</strong>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{log.timestamp}</span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                }}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}