import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Ambulance,
  BedDouble,
  Clock,
  Compass,
  HeartPulse,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  ShieldCheck,
  Umbrella,
} from 'lucide-react'

const MUMBAI_HOSPITAL_NETWORK = [
  {
    id: 'hosp-1',
    name: 'St. Catherine Medical Centre (Base)',
    area: 'Bandra West',
    distanceKm: 1.4,
    emergencyWaitMin: 22,
    freeBeds: 16,
    totalBeds: 120,
    icuAvailable: 3,
    weatherStatus: 'Normal Intake',
    diversionActive: false,
    phone: '+91 22 2642 1100',
    specialties: ['Trauma Center', '24/7 CT Scanner', 'Acute Resus'],
  },
  {
    id: 'hosp-2',
    name: 'Lokmanya Tilak Municipal General (Sion Hospital)',
    area: 'Sion',
    distanceKm: 3.8,
    emergencyWaitMin: 65,
    freeBeds: 4,
    totalBeds: 350,
    icuAvailable: 0,
    weatherStatus: 'Waterlogged Access Lane (Diverting non-critical)',
    diversionActive: true,
    phone: '+91 22 2407 6381',
    specialties: ['Level 1 Trauma', 'Monsoon Fever Clinic', 'Burn Unit'],
  },
  {
    id: 'hosp-3',
    name: 'King Edward Memorial Hospital (KEM)',
    area: 'Parel',
    distanceKm: 5.2,
    emergencyWaitMin: 48,
    freeBeds: 21,
    totalBeds: 420,
    icuAvailable: 5,
    weatherStatus: 'High Patient Inflow',
    diversionActive: false,
    phone: '+91 22 2410 7000',
    specialties: ['Cardiac Resus', 'Stat Pathology', 'Neurosciences'],
  },
  {
    id: 'hosp-4',
    name: 'Bhabha Municipal Hospital',
    area: 'Kurla West',
    distanceKm: 2.1,
    emergencyWaitMin: 78,
    freeBeds: 1,
    totalBeds: 90,
    icuAvailable: 0,
    weatherStatus: 'Severe Monsoon Inundation (Red Alert)',
    diversionActive: true,
    phone: '+91 22 2650 0144',
    specialties: ['Ambulatory Care', 'Emergency Ward'],
  },
  {
    id: 'hosp-5',
    name: 'Lilavati Hospital & Research Centre',
    area: 'Bandra Reclamation',
    distanceKm: 1.9,
    emergencyWaitMin: 15,
    freeBeds: 28,
    totalBeds: 250,
    icuAvailable: 8,
    weatherStatus: 'Normal Intake',
    diversionActive: false,
    phone: '+91 22 2675 1000',
    specialties: ['Advanced Diagnostics', 'ICU Multi-Bed', 'Cath Lab'],
  },
]

export default function FindHospital() {
  const [selectedWard, setSelectedWard] = useState('All')
  const [sortBy, setSortBy] = useState('distance') // 'distance', 'wait', 'beds'
  const [filterNonDiverted, setFilterNonDiverted] = useState(false)

  const filteredHospitals = useMemo(() => {
    return MUMBAI_HOSPITAL_NETWORK.filter(hosp => {
      if (filterNonDiverted && hosp.diversionActive) return false
      if (selectedWard !== 'All' && !hosp.area.toLowerCase().includes(selectedWard.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm
      if (sortBy === 'wait') return a.emergencyWaitMin - b.emergencyWaitMin
      if (sortBy === 'beds') return b.freeBeds - a.freeBeds
      return 0
    })
  }, [selectedWard, sortBy, filterNonDiverted])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner: Patient Portal Mode */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(13,148,136,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '4px' }}>
            CITIZEN & PATIENT TRIAGE PORTAL
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '8px 0 4px 0' }}>
            Find Nearest Available Emergency Care
          </h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            Live triage capacity, bed availability, and weather-adjusted route advisories across Mumbai.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#ffffff', color: '#0f766e', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} />
            <span>GPS Active: Bandra / Kurla Corridor</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>FILTER WARD:</span>
          {['All', 'Bandra', 'Kurla', 'Sion', 'Parel'].map(ward => (
            <button
              key={ward}
              type="button"
              onClick={() => setSelectedWard(ward)}
              style={{
                border: 'none',
                background: selectedWard === ward ? '#0f766e' : '#f1f5f9',
                color: selectedWard === ward ? '#ffffff' : '#334155',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {ward}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterNonDiverted}
              onChange={e => setFilterNonDiverted(e.target.checked)}
            />
            <span>Hide diverted hospitals</span>
          </label>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', background: '#f8fafc' }}
          >
            <option value="distance">Sort: Nearest first</option>
            <option value="wait">Sort: Shortest wait time</option>
            <option value="beds">Sort: Most available beds</option>
          </select>
        </div>
      </div>

      {/* Hospital Result Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredHospitals.map(hosp => {
          const isCrowded = hosp.emergencyWaitMin > 45
          const isCriticalBed = hosp.freeBeds <= 3

          return (
            <div
              key={hosp.id}
              style={{
                background: '#ffffff',
                border: hosp.diversionActive ? '2px solid #fecaca' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      {hosp.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {hosp.area} · <strong>{hosp.distanceKm} km away</strong>
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: hosp.diversionActive ? '#fee2e2' : '#ecfdf5',
                      color: hosp.diversionActive ? '#dc2626' : '#059669',
                    }}
                  >
                    {hosp.diversionActive ? '⚠ DIVERSION WARNING' : '✓ INTAKE OPEN'}
                  </span>
                </div>

                {/* 3 Metric Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '14px 0' }}>
                  <div style={{ background: isCrowded ? '#fef2f2' : '#f0fdf4', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>ER WAIT</span>
                    <strong style={{ fontSize: '16px', color: isCrowded ? '#dc2626' : '#059669' }}>
                      ~{hosp.emergencyWaitMin}m
                    </strong>
                  </div>

                  <div style={{ background: isCriticalBed ? '#fff7ed' : '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>FREE BEDS</span>
                    <strong style={{ fontSize: '16px', color: isCriticalBed ? '#ea580c' : '#0f172a' }}>
                      {hosp.freeBeds}
                    </strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>ICU BEDS</span>
                    <strong style={{ fontSize: '16px', color: hosp.icuAvailable > 0 ? '#0f766e' : '#dc2626' }}>
                      {hosp.icuAvailable}
                    </strong>
                  </div>
                </div>

                {/* Weather & Hazard Advisory Note */}
                <div
                  style={{
                    background: hosp.diversionActive ? '#fff1f2' : '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${hosp.diversionActive ? '#fecdd3' : '#e2e8f0'}`,
                    fontSize: '11px',
                    color: hosp.diversionActive ? '#9f1239' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '12px',
                  }}
                >
                  <Umbrella size={14} color={hosp.diversionActive ? '#e11d48' : '#0f766e'} />
                  <span><strong>Advisory:</strong> {hosp.weatherStatus}</span>
                </div>

                {/* Specialties Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {hosp.specialties.map(spec => (
                    <span
                      key={spec}
                      style={{ fontSize: '9px', fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <a
                  href={`tel:${hosp.phone}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#334155',
                    textDecoration: 'none',
                  }}
                >
                  <PhoneCall size={12} />
                  <span>Call ER</span>
                </a>

                <button
                  type="button"
                  onClick={() => alert(`Directing navigation to ${hosp.name} via safest non-flooded route.`)}
                  style={{
                    flex: 1.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#0f766e',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <Navigation size={12} />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}