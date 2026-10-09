import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Flame,
  Info,
  Layers,
  MapPin,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Wind,
} from 'lucide-react'

const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    incidentType: 'Waterlogging & Monsoon Surge',
    locality: 'Kurla',
    timestamp: '09/10/2026, 16:23:57',
    severity: '3/5',
    additionalPatients: 25,
    impact: 'Localized disruption',
    infrastructure: 'Normal',
    score: 64,
  },
  {
    id: 'rep-2',
    incidentType: 'Chemical Fume Advisory',
    locality: 'Chembur',
    timestamp: '08/10/2026, 11:15:20',
    severity: '2/5',
    additionalPatients: 15,
    impact: 'Minor ambulatory influx',
    infrastructure: 'Normal',
    score: 42,
  },
]

export default function MumbaiSurveillance() {
  const [locality, setLocality] = useState('Kurla')
  const [severity, setSeverity] = useState('3')
  const [expectedImpact, setExpectedImpact] = useState('Localized disruption')
  const [additionalPatients, setAdditionalPatients] = useState(25)
  const [infrastructureStatus, setInfrastructureStatus] = useState('Normal')
  const [officialWarning, setOfficialWarning] = useState('No / not yet checked')
  const [incidentNotes, setIncidentNotes] = useState('')
  const [incidentType, setIncidentType] = useState('Flash Flood / Monsoon')

  const [assessmentScore, setAssessmentScore] = useState(null)
  const [recentReports, setRecentReports] = useState(INITIAL_REPORTS)

  function calculateRiskScore(e) {
    e.preventDefault()

    // Deterministic calculation based on input severity and additional patient load
    let base = parseInt(severity, 10) * 16
    base += Math.min(30, Math.round(Number(additionalPatients) * 0.5))
    if (infrastructureStatus === 'Compromised') base += 18
    if (infrastructureStatus === 'Strained') base += 10
    if (officialWarning === 'Yes - High Alert') base += 12

    const finalScore = Math.min(100, Math.max(10, base))
    setAssessmentScore(finalScore)

    const now = new Date()
    const timestamp = `${now.toLocaleDateString('en-GB')}, ${now.toLocaleTimeString()}`

    const newReport = {
      id: `rep-${Date.now()}`,
      incidentType,
      locality,
      timestamp,
      severity: `${severity}/5`,
      additionalPatients: Number(additionalPatients),
      impact: expectedImpact,
      infrastructure: infrastructureStatus,
      score: finalScore,
    }

    setRecentReports(prev => [newReport, ...prev])
  }

  function handleClear() {
    setLocality('Kurla')
    setSeverity('3')
    setExpectedImpact('Localized disruption')
    setAdditionalPatients(25)
    setInfrastructureStatus('Normal')
    setOfficialWarning('No / not yet checked')
    setIncidentNotes('')
    setAssessmentScore(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>SURVEILLANCE DESK</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
          Mumbai Surveillance & Disaster Triage
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Real-time epidemiological, flood, and mass-casualty hazard assessment for the Greater Mumbai metropolitan network[cite: 9, 10].
        </p>
      </div>

      {/* Main Form & Assessment Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        {/* Left Column: Form */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <form onSubmit={calculateRiskScore} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Affected Locality / Ward[cite: 9, 10]
                </label>
                <select
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                >
                  <option value="Kurla">Kurla (L Ward - High Flood Risk)[cite: 9, 10]</option>
                  <option value="Sion">Sion (F/North Ward - Transit Corridor)[cite: 9, 10]</option>
                  <option value="Andheri">Andheri (K/East Ward - Western Suburbs)[cite: 9, 10]</option>
                  <option value="Dadar">Dadar (G/North Ward - Central Junction)</option>
                  <option value="Chembur">Chembur (M/West Ward)</option>
                  <option value="Bandra">Bandra (H/West Ward)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Incident Severity[cite: 9, 10]
                </label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                >
                  <option value="1">1 - Minor localized incident</option>
                  <option value="2">2 - Low operational friction</option>
                  <option value="3">3 - Moderate surge (Transit impact)[cite: 9, 10]</option>
                  <option value="4">4 - High severity alert</option>
                  <option value="5">5 - Critical mass casualty / disaster</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Expected Operational Impact[cite: 9, 10]
                </label>
                <select
                  value={expectedImpact}
                  onChange={e => setExpectedImpact(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                >
                  <option value="Localized disruption">Localized disruption[cite: 9, 10]</option>
                  <option value="Acute triage saturation">Acute triage saturation</option>
                  <option value="Ambulance route blockades">Ambulance route blockades</option>
                  <option value="Full facility diversion">Full facility diversion</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Estimated Additional Inflow (Patients)[cite: 9, 10]
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={additionalPatients}
                  onChange={e => setAdditionalPatients(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Hospital Infrastructure Status[cite: 9, 10]
                </label>
                <select
                  value={infrastructureStatus}
                  onChange={e => setInfrastructureStatus(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                >
                  <option value="Normal">Normal[cite: 9, 10]</option>
                  <option value="Strained">Strained (Power/Water backup active)</option>
                  <option value="Compromised">Compromised (Ground floor flooding)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Official Authority Warning Checked?[cite: 9, 10]
                </label>
                <select
                  value={officialWarning}
                  onChange={e => setOfficialWarning(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                >
                  <option value="No / not yet checked">No / not yet checked[cite: 9, 10]</option>
                  <option value="Yes - IMD Orange/Red Alert">Yes - IMD Orange/Red Alert</option>
                  <option value="Yes - BMC Disaster Cell Confirmed">Yes - BMC Disaster Cell Confirmed</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Incident Notes & Verified Observations[cite: 9, 10]
              </label>
              <textarea
                rows={3}
                placeholder="Enter verified observations only. Avoid personal patient information.[cite: 9, 10]"
                value={incidentNotes}
                onChange={e => setIncidentNotes(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleClear}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '9px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                Clear form[cite: 9, 10]
              </button>
              <button
                type="submit"
                style={{ background: '#0f766e', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Calculate risk score →[cite: 9, 10]</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Assessment Result Card */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Assessment result[cite: 9, 10]</span>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Calculated from submitted assumptions[cite: 9, 10]</span>

            <div style={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <div style={{ fontSize: '42px', fontWeight: 900, color: assessmentScore ? (assessmentScore >= 70 ? '#dc2626' : assessmentScore >= 50 ? '#ea580c' : '#0f766e') : '#0f172a' }}>
                {assessmentScore !== null ? assessmentScore : '--'}
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#94a3b8' }}>/100[cite: 9, 10]</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: assessmentScore ? '#fee2e2' : '#f1f5f9', color: assessmentScore ? '#dc2626' : '#64748b' }}>
                {assessmentScore !== null ? (assessmentScore >= 70 ? 'CRITICAL RISK' : 'MODERATE SURGE') : 'Awaiting report[cite: 9, 10]'}
              </span>
            </div>

            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
              Submit a disaster report to see the illustrative risk score and recommended preparedness actions[cite: 9, 10].
            </p>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '14px' }}>
              <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                Suggested readiness actions[cite: 9, 10]
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>
                <li>Verify official warnings and local authority updates[cite: 9, 10].</li>
                <li>Confirm the hospital incident lead and escalation contacts[cite: 9, 10].</li>
                <li>Review bed, staffing, power, water, and access contingencies[cite: 9, 10].</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px', color: '#64748b', marginBottom: '12px', display: 'flex', gap: '8px' }}>
              <Info size={14} color="#0f766e" style={{ flexShrink: 0 }} />
              <span>This is a heuristic prototype score, not an official hazard forecast[cite: 9, 10].</span>
            </div>

            <a
              href="https://sdma.maharashtra.gov.in"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Maharashtra SDMA ↗[cite: 9, 10]</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Disaster Reports */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '14px', margin: 0, color: '#0f172a' }}>Recent disaster reports[cite: 9, 10]</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Stored in this browser only; no server database[cite: 9, 10].</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentReports([])}
            style={{ fontSize: '11px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Clear log[cite: 9, 10]
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentReports.map(rep => (
            <div
              key={rep.id}
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>
                    {rep.incidentType} · {rep.locality}[cite: 9, 10]
                  </strong>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{rep.timestamp}[cite: 9, 10]</span>
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                  Severity {rep.severity} · Additional patients: {rep.additionalPatients} | {rep.impact} · Infrastructure: {rep.infrastructure}[cite: 9, 10]
                </div>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: rep.score >= 60 ? '#fee2e2' : '#ecfdf5',
                  color: rep.score >= 60 ? '#dc2626' : '#059669',
                  border: `1px solid ${rep.score >= 60 ? '#fecaca' : '#a7f3d0'}`,
                }}
              >
                {rep.score}/100[cite: 9, 10]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}