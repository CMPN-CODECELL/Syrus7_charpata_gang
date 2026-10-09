import { useState, useMemo } from 'react'
import {
  BrainCircuit,
  Clock,
  Layers,
  RotateCcw,
  Sliders,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function WhatIf() {
  const [arrivalSurge, setArrivalSurge] = useState(30)
  const [staffShortage, setStaffShortage] = useState(10)
  const [diagnosticCapacity, setDiagnosticCapacity] = useState(80)
  const [availableBeds, setAvailableBeds] = useState(42)
  const [dischargeDelay, setDischargeDelay] = useState(45)
  const [equipmentFailure, setEquipmentFailure] = useState('CT scanner · 3 hours')

  // Dynamic Multi-Line Chart Calculation
  const { chartData, peakLoad, medianWait, deptsAtRisk } = useMemo(() => {
    const shockFactor = 1 + (arrivalSurge / 100) * 0.4 + (staffShortage / 100) * 0.3 - ((diagnosticCapacity - 100) / 100) * 0.2 + (dischargeDelay / 60) * 0.15

    const basePoints = [
      { time: 'Now', baseline: 65, sim: Math.round(65 * (1 + arrivalSurge * 0.003)) },
      { time: '2 PM', baseline: 70, sim: Math.round(70 * shockFactor * 0.95) },
      { time: '4 PM', baseline: 74, sim: Math.round(74 * shockFactor * 1.05) },
      { time: '6 PM', baseline: 78, sim: Math.round(78 * shockFactor * 1.15) },
      { time: '8 PM', baseline: 82, sim: Math.round(82 * shockFactor * 1.25) },
      { time: '10 PM', baseline: 85, sim: Math.round(85 * shockFactor * 1.35) },
    ]

    const calculatedPeak = Math.max(...basePoints.map(p => p.sim))
    const calculatedWait = Math.round(28 + (calculatedPeak - 70) * 0.9)
    const riskCount = calculatedPeak >= 115 ? 5 : calculatedPeak >= 100 ? 4 : calculatedPeak >= 85 ? 3 : 1

    return {
      chartData: basePoints,
      peakLoad: calculatedPeak,
      medianWait: calculatedWait,
      deptsAtRisk: riskCount,
    }
  }, [arrivalSurge, staffShortage, diagnosticCapacity, dischargeDelay])

  function handleReset() {
    setArrivalSurge(30)
    setStaffShortage(10)
    setDiagnosticCapacity(80)
    setAvailableBeds(42)
    setDischargeDelay(45)
    setEquipmentFailure('CT scanner · 3 hours')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Title */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '1px' }}>SCENARIO LAB</span>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
          What-if simulator[cite: 7]
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Test operational scenarios before committing resources.[cite: 7]
        </p>
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(0, 1.8fr)', gap: '20px' }}>
        {/* Left Column: Sliders */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>Scenario inputs[cite: 7]</strong>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Adjust assumptions to model potential impact.[cite: 7]</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Slider 1: Patient arrival surge */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Patient arrival surge[cite: 7]</span>
                <strong style={{ color: '#0d9488' }}>{arrivalSurge}%[cite: 7]</strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={arrivalSurge}
                onChange={e => setArrivalSurge(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>0%[cite: 7]</span>
                <span>60%[cite: 7]</span>
              </div>
            </div>

            {/* Slider 2: Staff shortage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Staff shortage[cite: 7]</span>
                <strong style={{ color: '#0d9488' }}>{staffShortage}%[cite: 7]</strong>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={staffShortage}
                onChange={e => setStaffShortage(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>0%[cite: 7]</span>
                <span>40%[cite: 7]</span>
              </div>
            </div>

            {/* Slider 3: Diagnostic capacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Diagnostic capacity[cite: 7]</span>
                <strong style={{ color: '#0d9488' }}>{diagnosticCapacity}%[cite: 7]</strong>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={diagnosticCapacity}
                onChange={e => setDiagnosticCapacity(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>40%[cite: 7]</span>
                <span>120%[cite: 7]</span>
              </div>
            </div>

            {/* Slider 4: Available beds */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Available beds[cite: 7]</span>
                <strong style={{ color: '#0d9488' }}>{availableBeds} beds[cite: 7]</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={availableBeds}
                onChange={e => setAvailableBeds(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>10 beds[cite: 7]</span>
                <span>80 beds[cite: 7]</span>
              </div>
            </div>

            {/* Slider 5: Discharge delay */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Discharge delay[cite: 7]</span>
                <strong style={{ color: '#0d9488' }}>{dischargeDelay} min[cite: 7]</strong>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={dischargeDelay}
                onChange={e => setDischargeDelay(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>0 min[cite: 7]</span>
                <span>120 min[cite: 7]</span>
              </div>
            </div>

            {/* Equipment Failure Dropdown */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Equipment failure[cite: 7]
              </label>
              <select
                value={equipmentFailure}
                onChange={e => setEquipmentFailure(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
              >
                <option value="CT scanner · 3 hours">CT scanner · 3 hours[cite: 7]</option>
                <option value="X-Ray Unit 1 · 2 hours">X-Ray Unit 1 · 2 hours</option>
                <option value="Stat Lab Centrifuge · 1 hour">Stat Lab Centrifuge · 1 hour</option>
                <option value="None">None (All systems online)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Baseline vs Simulated Projection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>Baseline vs simulated[cite: 7]</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Illustrative peak in the next 8 hours[cite: 7]</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb' }}>
                Scenario only[cite: 7]
              </span>
            </div>

            {/* 3 Metric Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Peak emergency load[cite: 7]</span>
                <strong style={{ fontSize: '24px', color: peakLoad >= 100 ? '#ef4444' : '#0f172a' }}>{peakLoad}%[cite: 7]</strong>
                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, display: 'block' }}>+{peakLoad - 85}%[cite: 7]</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Median wait time[cite: 7]</span>
                <strong style={{ fontSize: '24px', color: medianWait >= 50 ? '#ef4444' : '#0f172a' }}>{medianWait}m[cite: 7]</strong>
                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, display: 'block' }}>+{medianWait - 38}m[cite: 7]</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Departments at risk[cite: 7]</span>
                <strong style={{ fontSize: '24px', color: '#0f172a' }}>{deptsAtRisk}[cite: 7]</strong>
                <span style={{ fontSize: '10px', color: '#ea580c', fontWeight: 700, display: 'block' }}>+2[cite: 7]</span>
              </div>
            </div>

            {/* Line Chart */}
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 130]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sim" stroke="#ef4444" strokeWidth={3} dot={false} name="Simulated Load" />
                  <Line type="monotone" dataKey="baseline" stroke="#60a5fa" strokeWidth={2.5} dot={false} name="Baseline Load" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '10px' }}>
              Simulation, not a live forecast. Outputs are based on simplified demonstration assumptions.[cite: 7]
            </span>
          </div>

          {/* Scenario Interpretation Card */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>Scenario interpretation[cite: 7]</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#0d9488' }}>01[cite: 7]</span>
              <div>
                <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>Emergency capacity pressure increases[cite: 7]</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Higher arrivals can make queues grow earlier.[cite: 7]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}