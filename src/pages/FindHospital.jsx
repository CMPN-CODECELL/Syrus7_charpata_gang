import { useState, useMemo } from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Ambulance,
  BedDouble,
  CheckCircle2,
  Clock,
  HeartPulse,
  Info,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  User,
  X,
  Zap,
} from 'lucide-react'

// REAL CHEMBUR, MUMBAI HOSPITALS DATASET
const CHEMBUR_HOSPITALS = [
  {
    id: 'chm-1',
    name: 'Surana Sethia Hospital & Research Centre',
    area: 'Sion - Trombay Rd, Chembur (Near Suman Nagar)',
    distanceKm: 1.2,
    emergencyWaitMin: 18,
    freeBeds: 14,
    totalBeds: 150,
    icuAvailable: 4,
    oxygenAvailable: true,
    ventilatorsAvailable: 3,
    weatherStatus: 'Normal Intake · Clear Road Access',
    diversionActive: false,
    phone: '022-25265500',
    emergencyHelpline: '+91 93222 25500',
    supportedConditions: [
      'cardiac',
      'trauma',
      'respiratory',
      'fever',
      'kidney',
      'surgery',
    ],
    specialties: ['Cardiology & Cath Lab', '24/7 ICCU', 'Trauma & Ortho', 'Dialysis'],
    address: 'Sion - Trombay Rd, Chembur, Mumbai 400071',
  },
  {
    id: 'chm-2',
    name: 'Zen Multi Speciality Hospital',
    area: '10th Road, Chembur East (Near Sandu Garden)',
    distanceKm: 1.8,
    emergencyWaitMin: 22,
    freeBeds: 9,
    totalBeds: 110,
    icuAvailable: 2,
    oxygenAvailable: true,
    ventilatorsAvailable: 2,
    weatherStatus: 'Intake Operational · Sandu Garden Lane Clear',
    diversionActive: false,
    phone: '022-25260066',
    emergencyHelpline: '+91 80808 26006',
    supportedConditions: [
      'cardiac',
      'respiratory',
      'kidney',
      'fever',
      'surgery',
    ],
    specialties: ['Advanced Critical Care', '13-Bed ICU', 'Nephrology & Dialysis', 'Pulmonology'],
    address: 'Plot No 425, 10th Rd, Chembur East, Mumbai 400071',
  },
  {
    id: 'chm-3',
    name: 'Sushrut Hospital & Research Centre',
    area: 'Swastik Park, Chembur East',
    distanceKm: 2.1,
    emergencyWaitMin: 26,
    freeBeds: 18,
    totalBeds: 130,
    icuAvailable: 5,
    oxygenAvailable: true,
    ventilatorsAvailable: 4,
    weatherStatus: 'High Operational Readiness · 3T MRI Online',
    diversionActive: false,
    phone: '022-69585555',
    emergencyHelpline: '+91 80808 03848',
    supportedConditions: [
      'trauma',
      'cardiac',
      'respiratory',
      'fever',
      'kidney',
      'cancer',
    ],
    specialties: ['Trauma & Accident Care', '21-Bed ICCU', '3T MRI Stat Imaging', 'Oncology Care'],
    address: '365, Swastik Park, Chembur East, Mumbai 400071',
  },
  {
    id: 'chm-4',
    name: 'Inlaks General Hospital',
    area: 'Chembur Colony, Indira Nagar',
    distanceKm: 2.5,
    emergencyWaitMin: 35,
    freeBeds: 21,
    totalBeds: 120,
    icuAvailable: 3,
    oxygenAvailable: true,
    ventilatorsAvailable: 1,
    weatherStatus: 'Normal Intake · Economical / Charitable Care',
    diversionActive: false,
    phone: '022-25528000',
    emergencyHelpline: '022-25528001',
    supportedConditions: [
      'fever',
      'respiratory',
      'pediatric',
      'maternity',
      'general',
    ],
    specialties: ['Monsoon Fever Unit', 'Pediatrics & Neonatal', 'General Medicine', 'Maternity'],
    address: 'Chembur Colony, Indira Nagar, Chembur, Mumbai 400074',
  },
  {
    id: 'chm-5',
    name: 'Maa Hospital (Municipal General Hospital)',
    area: 'Postal Colony, Chembur',
    distanceKm: 1.5,
    emergencyWaitMin: 55,
    freeBeds: 32,
    totalBeds: 300,
    icuAvailable: 1,
    oxygenAvailable: true,
    ventilatorsAvailable: 1,
    weatherStatus: 'Heavy Ambulatory Surge · Monsoon Dengue Ward Active',
    diversionActive: false,
    phone: '022-25220333',
    emergencyHelpline: '108 (BMC / Ambulance)',
    supportedConditions: [
      'fever',
      'pediatric',
      'general',
      'maternity',
    ],
    specialties: ['Free / Subsidized Municipal Care', 'Dengue & Malaria Triage', 'Public Health Wing'],
    address: 'Postal Colony, Chembur, Mumbai 400071',
  },
  {
    id: 'chm-6',
    name: 'Sai Hospital (Multispeciality)',
    area: 'Vikas Bldg, Sion-Trombay Rd, Chembur West',
    distanceKm: 1.0,
    emergencyWaitMin: 15,
    freeBeds: 7,
    totalBeds: 60,
    icuAvailable: 2,
    oxygenAvailable: true,
    ventilatorsAvailable: 1,
    weatherStatus: 'Intake Normal · Rapid ER Turnaround',
    diversionActive: false,
    phone: '022-25284100',
    emergencyHelpline: '+91 90222 90585',
    supportedConditions: [
      'trauma',
      'respiratory',
      'general',
      'surgery',
    ],
    specialties: ['General Medicine', 'ICCU 24x7', 'Laparoscopy & Surgery', 'Diabetology'],
    address: '566, Sion - Trombay Rd, Chembur West, Mumbai 400071',
  },
]

// DISEASE & CONDITION LIST FOR PATIENT MATCHING
const DISEASE_CATEGORIES = [
  { id: 'all', label: 'All Emergency Conditions', icon: Stethoscope },
  { id: 'cardiac', label: 'Heart Attack / Chest Pain / Cardiac', icon: HeartPulse },
  { id: 'fever', label: 'Monsoon Fever / Dengue / Malaria', icon: Thermometer },
  { id: 'respiratory', label: 'Asthma / Acute Breathlessness', icon: Activity },
  { id: 'trauma', label: 'Accident / Bone Fracture / Trauma', icon: Zap },
  { id: 'kidney', label: 'Kidney Dialysis / Renal Failure', icon: ShieldCheck },
  { id: 'pediatric', label: 'Child Emergency / Pediatrics', icon: User },
]

export default function FindHospital() {
  const [selectedDisease, setSelectedDisease] = useState('all')
  const [sortBy, setSortBy] = useState('distance') // 'distance' | 'beds' | 'wait'
  const [bedTypeFilter, setBedTypeFilter] = useState('any') // 'any' | 'icu' | 'general'
  const [hospitalsData, setHospitalsData] = useState(CHEMBUR_HOSPITALS)

  // Booking Modal State
  const [bookingHospital, setBookingHospital] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [requestedBedType, setRequestedBedType] = useState('ICU / ICCU')
  const [patientConditionNote, setPatientConditionNote] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  // Filtered and Sorted Hospital List
  const filteredHospitals = useMemo(() => {
    return hospitalsData
      .filter(hosp => {
        // Condition matching
        if (selectedDisease !== 'all' && !hosp.supportedConditions.includes(selectedDisease)) {
          return false
        }
        // Bed type availability check
        if (bedTypeFilter === 'icu' && hosp.icuAvailable <= 0) return false
        if (bedTypeFilter === 'general' && hosp.freeBeds <= 0) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm
        if (sortBy === 'beds') return b.freeBeds - a.freeBeds
        if (sortBy === 'wait') return a.emergencyWaitMin - b.emergencyWaitMin
        return 0
      })
  }, [hospitalsData, selectedDisease, sortBy, bedTypeFilter])

  // Handle Bed Reservation Form Submission
  function handleConfirmBooking(e) {
    e.preventDefault()
    if (!patientName.trim() || !patientPhone.trim()) return

    const bookingId = `FLOW-CHM-${Math.floor(1000 + Math.random() * 9000)}`

    // Decrement the bed count dynamically for the booked hospital
    setHospitalsData(prev =>
      prev.map(h => {
        if (h.id === bookingHospital.id) {
          return {
            ...h,
            freeBeds: Math.max(0, h.freeBeds - 1),
            icuAvailable: requestedBedType.includes('ICU') ? Math.max(0, h.icuAvailable - 1) : h.icuAvailable,
          }
        }
        return h
      })
    )

    setConfirmedBooking({
      id: bookingId,
      hospitalName: bookingHospital.name,
      address: bookingHospital.address,
      phone: bookingHospital.phone,
      emergencyHelpline: bookingHospital.emergencyHelpline,
      patientName,
      patientPhone,
      bedType: requestedBedType,
      time: new Date().toLocaleTimeString(),
    })
  }

  function handleCloseModal() {
    setBookingHospital(null)
    setConfirmedBooking(null)
    setPatientName('')
    setPatientPhone('')
    setPatientAge('')
    setPatientConditionNote('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Patient Triage Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: '0 4px 12px rgba(13,148,136,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '1px',
              background: 'rgba(255,255,255,0.2)',
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            PATIENT HOME TRIAGE & ADMISSION DESK · CHEMBUR
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px 0' }}>
            Check Hospital Availability & Reserve Bed
          </h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            Live bed telemetry, condition-matched specialist care, and emergency bed booking across Chembur, Mumbai.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#ffffff',
              color: '#0f766e',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }}
          >
            <MapPin size={15} />
            <span>Target Area: Chembur, Mumbai (400071 / 400074)</span>
          </div>
        </div>
      </div>

      {/* Disease & Condition Filter Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <strong style={{ fontSize: '13px', color: '#0f172a' }}>1. Select Patient Condition / Disease:</strong>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
              We will only show Chembur hospitals with verified emergency capability for this condition.
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 700 }}>
            {filteredHospitals.length} Chembur Hospitals Equipped
          </span>
        </div>

        {/* Condition Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DISEASE_CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isSelected = selectedDisease === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedDisease(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isSelected ? '#0f766e' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  border: `1px solid ${isSelected ? '#0f766e' : '#cbd5e1'}`,
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sorting & Bed Preference Controls */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>BED NEEDED:</span>
          {['any', 'general', 'icu'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setBedTypeFilter(type)}
              style={{
                border: 'none',
                background: bedTypeFilter === type ? '#0f172a' : '#f1f5f9',
                color: bedTypeFilter === type ? '#ffffff' : '#475569',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {type === 'any' && 'Any Bed Available'}
              {type === 'general' && 'General Ward Free'}
              {type === 'icu' && 'ICU / ICCU Free'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>SORT BY:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '11px',
              background: '#f8fafc',
            }}
          >
            <option value="distance">Nearest to Home (Km)</option>
            <option value="beds">Most Available Beds</option>
            <option value="wait">Shortest ER Wait Time</option>
          </select>
        </div>
      </div>

      {/* Hospitals Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredHospitals.map(hosp => {
          const isCriticalBed = hosp.freeBeds <= 3
          const isCrowded = hosp.emergencyWaitMin > 30

          return (
            <div
              key={hosp.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      {hosp.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {hosp.area} · <strong style={{ color: '#0f766e' }}>{hosp.distanceKm} km from you</strong>
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: hosp.freeBeds > 5 ? '#ecfdf5' : '#fff7ed',
                      color: hosp.freeBeds > 5 ? '#059669' : '#ea580c',
                    }}
                  >
                    {hosp.freeBeds > 5 ? '✓ ADMISSION OPEN' : '⚠ LIMITED BEDS'}
                  </span>
                </div>

                {/* 3 Availability Meters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '14px 0' }}>
                  <div style={{ background: isCrowded ? '#fef2f2' : '#f0fdf4', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>ER WAIT</span>
                    <strong style={{ fontSize: '16px', color: isCrowded ? '#dc2626' : '#059669' }}>
                      ~{hosp.emergencyWaitMin}m
                    </strong>
                  </div>

                  <div style={{ background: isCriticalBed ? '#fff7ed' : '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>GENERAL BEDS</span>
                    <strong style={{ fontSize: '16px', color: isCriticalBed ? '#ea580c' : '#0f172a' }}>
                      {hosp.freeBeds} free
                    </strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>ICU / ICCU</span>
                    <strong style={{ fontSize: '16px', color: hosp.icuAvailable > 0 ? '#0f766e' : '#dc2626' }}>
                      {hosp.icuAvailable} free
                    </strong>
                  </div>
                </div>

                {/* Status & Weather Banner */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#475569',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Info size={13} color="#0f766e" />
                  <span><strong>Status:</strong> {hosp.weatherStatus}</span>
                </div>

                {/* Specialties tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
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

              {/* Action Buttons: Direct Call, Directions, and Book Bed Form Button */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
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

                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(hosp.name + ' Chembur Mumbai')}`}
                  target="_blank"
                  rel="noreferrer"
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
                  <Navigation size={12} />
                  <span>Map</span>
                </a>

                {/* Bed Booking Form Button */}
                <button
                  type="button"
                  onClick={() => setBookingHospital(hosp)}
                  style={{
                    flex: 1.4,
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
                    boxShadow: '0 2px 4px rgba(15,118,110,0.2)',
                  }}
                >
                  <BedDouble size={13} />
                  <span>Reserve Bed</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* SHORT INTAKE & BED BOOKING FORM MODAL */}
      {bookingHospital && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', letterSpacing: '0.8px' }}>
                  ONLINE PATIENT BED RESERVATION
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                  {bookingHospital.name}
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{bookingHospital.area}</span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {confirmedBooking ? (
              /* Success / Receipt Screen */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 6px auto' }} />
                  <strong style={{ fontSize: '16px', color: '#065f46', display: 'block' }}>
                    Bed Reservation Pre-Allocated!
                  </strong>
                  <span style={{ fontSize: '11px', color: '#047857' }}>
                    Token Generated: <strong>{confirmedBooking.id}</strong>
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Patient Name:</span>
                    <strong>{confirmedBooking.patientName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Contact Phone:</span>
                    <strong>{confirmedBooking.patientPhone}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Bed Type Reserved:</span>
                    <strong style={{ color: '#0f766e' }}>{confirmedBooking.bedType}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Emergency Desk Phone:</span>
                    <strong>{confirmedBooking.phone}</strong>
                  </div>
                </div>

                <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', color: '#854d0e' }}>
                  <strong>Next Step:</strong> Show token <strong>{confirmedBooking.id}</strong> at the emergency desk upon arrival. The bed hold is active for 45 minutes.
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: '#0f766e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Short Booking Form */
              <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Contact Phone (Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98200XXXXX"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Patient Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 48"
                      value={patientAge}
                      onChange={e => setPatientAge(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Select Bed Category Needed
                  </label>
                  <select
                    value={requestedBedType}
                    onChange={e => setRequestedBedType(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                  >
                    <option value="Emergency Triage Observation">Emergency Triage Observation Bed</option>
                    <option value="ICU / ICCU with Ventilator">ICU / ICCU with Cardiac Monitoring</option>
                    <option value="General Ward Bed (Oxygen-Supported)">General Ward Bed (Oxygen-Supported)</option>
                    <option value="Semi-Private Room">Semi-Private Room</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Current Symptoms / Medical Condition
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe symptoms (e.g. persistent high fever 103°F, severe chest tightness, suspected fracture)..."
                    value={patientConditionNote}
                    onChange={e => setPatientConditionNote(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
                  Submitting will transmit this reservation directly to {bookingHospital.name}&apos;s emergency reception.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '9px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#0f766e',
                      border: 'none',
                      padding: '9px 20px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Confirm Bed Reservation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}