import { useState, useMemo } from 'react'
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  HeartPulse,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react'

// =========================================================================
// 1. DATASET: 2 STAFF FOR EACH OF THE 6 SPECIFIC CONDITIONS / DEPTS
// =========================================================================
const INITIAL_TEAM_MEMBERS = [
  // Platform Admin / Owner
  {
    id: 'owner-1',
    name: 'Piyush Poptani',
    email: 'poptani@flowguard.in',
    phone: '+91 98200 11000',
    designation: 'Hospital Director & Medical Superintendent',
    role: 'Platform Admin',
    department: 'Hospital Command',
    diseaseSpecialty: 'Executive Operations',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: true,
  },
  // 1. CARDIOLOGY / CHEST PAIN (2 Staff)
  {
    id: 'staff-cardio-1',
    name: 'Dr. Rajesh Mehta',
    email: 'dr.mehta@surana.in',
    phone: '+91 98201 11234',
    designation: 'Chief Interventional Cardiologist',
    role: 'Attending Doctor',
    department: 'ICCU / Cardiology',
    diseaseSpecialty: 'Heart Attack / Acute Chest Pain',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 2,
    callingAccess: true,
  },
  {
    id: 'staff-cardio-2',
    name: 'Sandeepan Chakraborty',
    email: 'sandeepan.c@surana.in',
    phone: '+91 98202 22345',
    designation: 'Senior ICCU Clinical Nurse',
    role: 'Staff Nurse',
    department: 'ICCU / Cardiology',
    diseaseSpecialty: 'Heart Attack / Acute Chest Pain',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 1,
    callingAccess: false,
  },
  // 2. MONSOON FEVER / DENGUE / MALARIA (2 Staff)
  {
    id: 'staff-fever-1',
    name: 'Dr. Shaswat Jain',
    email: 'shaswat.jain@surana.in',
    phone: '+91 98203 33456',
    designation: 'Infectious Diseases & Monsoon Fever Lead',
    role: 'Attending Doctor',
    department: 'Monsoon Triage Ward',
    diseaseSpecialty: 'Dengue / Malaria / 103°F High Fever',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 1,
    callingAccess: true,
  },
  {
    id: 'staff-fever-2',
    name: 'Preeti Nair',
    email: 'preeti.nair@surana.in',
    phone: '+91 98204 44567',
    designation: 'Platelet & Hydration Ward In-Charge',
    role: 'Staff Nurse',
    department: 'Monsoon Triage Ward',
    diseaseSpecialty: 'Dengue / Malaria / 103°F High Fever',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: false,
  },
  // 3. RESPIRATORY / ASTHMA / BREATHLESSNESS (2 Staff)
  {
    id: 'staff-resp-1',
    name: 'Dr. Srishti Jain',
    email: 'srishti.jain@surana.in',
    phone: '+91 98205 55678',
    designation: 'Pulmonologist & Critical Care Specialist',
    role: 'Department Lead',
    department: 'Emergency & Pulmonology',
    diseaseSpecialty: 'Severe Asthma / Acute Breathlessness',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active this week',
    assignedPatients: 1,
    callingAccess: true,
  },
  {
    id: 'staff-resp-2',
    name: 'Vedant Maheshwari',
    email: 'vedant.m@surana.in',
    phone: '+91 98206 66789',
    designation: 'Respiratory Therapy & Oxygen Station Officer',
    role: 'Staff Nurse',
    department: 'Emergency & Pulmonology',
    diseaseSpecialty: 'Severe Asthma / Acute Breathlessness',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active this week',
    assignedPatients: 0,
    callingAccess: false,
  },
  // 4. ORTHOPEDICS / BONE TRAUMA / FRACTURE (2 Staff)
  {
    id: 'staff-trauma-1',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@surana.in',
    phone: '+91 98207 77890',
    designation: 'Consultant Orthopedic & Trauma Surgeon',
    role: 'Attending Doctor',
    department: 'Trauma & Orthopedics',
    diseaseSpecialty: 'Bone Fractures / Accident Trauma',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 1,
    callingAccess: true,
  },
  {
    id: 'staff-trauma-2',
    name: 'Jay Ashwin Choudhary',
    email: 'jayashwin.ch@gmail.com',
    phone: '+91 98208 88901',
    designation: 'Emergency Trauma Plaster & Triage Nurse',
    role: 'Staff Nurse',
    department: 'Trauma & Orthopedics',
    diseaseSpecialty: 'Bone Fractures / Accident Trauma',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'pending', // Screenshot pending example
    lastActive: 'Has not signed up yet',
    assignedPatients: 0,
    callingAccess: false,
  },
  // 5. NEPHROLOGY / KIDNEY DIALYSIS (2 Staff)
  {
    id: 'staff-renal-1',
    name: 'Dr. Pradeep Kulkarni',
    email: 'pradeep.k@surana.in',
    phone: '+91 98209 99012',
    designation: 'Chief Nephrologist & Dialysis Lead',
    role: 'Attending Doctor',
    department: 'Nephrology & Dialysis',
    diseaseSpecialty: 'Acute Renal Failure / Emergency Dialysis',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: true,
  },
  {
    id: 'staff-renal-2',
    name: 'Rohan Varma',
    email: 'rohan.v@surana.in',
    phone: '+91 98210 10123',
    designation: 'Hemodialysis Senior Station Technician',
    role: 'Staff Nurse',
    department: 'Nephrology & Dialysis',
    diseaseSpecialty: 'Acute Renal Failure / Emergency Dialysis',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: false,
  },
  // 6. PEDIATRICS / CHILD EMERGENCY (2 Staff)
  {
    id: 'staff-peds-1',
    name: 'Dr. Sneha Kadam',
    email: 'sneha.kadam@surana.in',
    phone: '+91 98211 21234',
    designation: 'Senior Consultant Pediatrician',
    role: 'Attending Doctor',
    department: 'Pediatrics Wing',
    diseaseSpecialty: 'Child Emergency / High Pediatric Fever',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: true,
  },
  {
    id: 'staff-peds-2',
    name: 'Farhan Ali',
    email: 'farhan.ali@surana.in',
    phone: '+91 98212 32345',
    designation: 'Neonatal & Pediatric Care Specialist Nurse',
    role: 'Staff Nurse',
    department: 'Pediatrics Wing',
    diseaseSpecialty: 'Child Emergency / High Pediatric Fever',
    hospitalName: 'Surana Sethia Medical Centre',
    status: 'active',
    lastActive: 'Active today',
    assignedPatients: 0,
    callingAccess: false,
  },
]

// CHEMBUR HOSPITALS WITH SPECIALISTS MATCHING
const CHEMBUR_HOSPITALS = [
  {
    id: 'chm-1',
    name: 'Surana Sethia Medical Centre',
    area: 'Sion - Trombay Rd, Chembur (Near Suman Nagar)',
    generalBedsFree: 14,
    icuBedsFree: 4,
    supportedDiseases: [
      'Heart Attack / Acute Chest Pain',
      'Dengue / Malaria / 103°F High Fever',
      'Severe Asthma / Acute Breathlessness',
      'Bone Fractures / Accident Trauma',
      'Acute Renal Failure / Emergency Dialysis',
      'Child Emergency / High Pediatric Fever',
    ],
  },
  {
    id: 'chm-2',
    name: 'Zen Multi Speciality Hospital',
    area: '10th Road, Chembur East (Near Sandu Garden)',
    generalBedsFree: 9,
    icuBedsFree: 2,
    supportedDiseases: [
      'Heart Attack / Acute Chest Pain',
      'Severe Asthma / Acute Breathlessness',
      'Acute Renal Failure / Emergency Dialysis',
    ],
  },
  {
    id: 'chm-3',
    name: 'Sushrut Hospital & Research Centre',
    area: 'Swastik Park, Chembur East',
    generalBedsFree: 18,
    icuBedsFree: 5,
    supportedDiseases: [
      'Bone Fractures / Accident Trauma',
      'Dengue / Malaria / 103°F High Fever',
      'Heart Attack / Acute Chest Pain',
    ],
  },
]

export default function HospitalOSNexus() {
  // SESSION STATE: 'patient' | 'admin' | 'staff' | 'login'
  const [activeSession, setActiveSession] = useState('patient') // default starting portal
  const [currentUser, setCurrentUser] = useState(null) // holds logged in staff or admin profile

  // AUTH STATE
  const [loginEmail, setLoginEmail] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regDept, setRegDept] = useState('ICCU / Cardiology')
  const [regRole, setRegRole] = useState('Staff Nurse')

  // DATA STATE
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS)
  const [hospitals, setHospitals] = useState(CHEMBUR_HOSPITALS)
  const [selectedHospital, setSelectedHospital] = useState(CHEMBUR_HOSPITALS[0])

  // PATIENT PROBLEM TYPING & DROPDOWN STATE
  const [problemSearch, setProblemSearch] = useState('')
  const [selectedDiseaseDropdown, setSelectedDiseaseDropdown] = useState('All')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientBedType, setPatientBedType] = useState('ICCU Bed')
  const [generatedToken, setGeneratedToken] = useState(null)

  // INCOMING ALLOTMENTS QUEUE
  const [allotments, setAllotments] = useState([
    {
      id: 'FLOW-CHM-3912',
      patientName: 'Rameshwar Patil',
      phone: '+91 98200 12890',
      disease: 'Heart Attack / Acute Chest Pain',
      department: 'ICCU / Cardiology',
      bedType: 'ICCU Bed',
      hospitalName: 'Surana Sethia Medical Centre',
      timeAgo: '8m ago',
      status: 'Awaiting Allotment',
      assignedStaffEmail: null,
      assignedStaffName: null,
    },
  ])

  // OWNER DISPATCH MODAL
  const [dispatchingAllotment, setDispatchingAllotment] = useState(null)
  const [selectedAssigneeEmail, setSelectedAssigneeEmail] = useState('dr.mehta@surana.in')

  // ADD NEW STAFF MODAL (OWNER)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [newStaffName, setNewStaffName] = useState('')
  const [newStaffEmail, setNewStaffEmail] = useState('')
  const [newStaffDept, setNewStaffDept] = useState('ICCU / Cardiology')
  const [newStaffRole, setNewStaffRole] = useState('Attending Doctor')

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIC
  // -------------------------------------------------------------
  function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError('')

    const cleanEmail = loginEmail.trim().toLowerCase()

    // 1. Check if Admin / Owner
    if (cleanEmail === 'poptani@flowguard.in' || cleanEmail === 'admin@flowguard.in') {
      const adminProfile = teamMembers.find(m => m.role === 'Platform Admin')
      setCurrentUser(adminProfile)
      setActiveSession('admin')
      setLoginEmail('')
      return
    }

    // 2. Check if registered Staff
    const matchedStaff = teamMembers.find(m => m.email.toLowerCase() === cleanEmail)

    if (!matchedStaff) {
      setLoginError(
        'Staff email not found on the roster. The Hospital Owner must add your email first, or you can register below.'
      )
      return
    }

    if (matchedStaff.status === 'pending') {
      setLoginError(
        'Registration Pending: Your email has been registered, but Hospital Owner Piyush Poptani must approve your access from Team & Roles.'
      )
      return
    }

    // Successfully authenticated staff member!
    setCurrentUser(matchedStaff)
    setActiveSession('staff')
    setLoginEmail('')
  }

  function handleStaffSelfRegister(e) {
    e.preventDefault()
    if (!regEmail.trim() || !regName.trim()) return

    const newPendingStaff = {
      id: `staff-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: '+91 98200 00000',
      designation: `${regRole} (${regDept})`,
      role: regRole,
      department: regDept,
      diseaseSpecialty: regDept,
      hospitalName: 'Surana Sethia Medical Centre',
      status: 'pending', // Pending owner approval
      lastActive: 'Has not signed up yet',
      assignedPatients: 0,
      callingAccess: false,
    }

    setTeamMembers(prev => [newPendingStaff, ...prev])
    setShowRegisterModal(false)
    setLoginError(
      'Account submitted! Please notify Hospital Owner Piyush Poptani to approve your email from the Admin desk.'
    )
    setRegName('')
    setRegEmail('')
  }

  function handleLogout() {
    setCurrentUser(null)
    setActiveSession('login')
  }

  // -------------------------------------------------------------
  // PATIENT SEARCH FILTERING
  // -------------------------------------------------------------
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      if (selectedDiseaseDropdown !== 'All' && !h.supportedDiseases.includes(selectedDiseaseDropdown)) {
        return false
      }
      if (problemSearch.trim()) {
        const query = problemSearch.toLowerCase()
        const matchName = h.name.toLowerCase().includes(query)
        const matchDisease = h.supportedDiseases.some(d => d.toLowerCase().includes(query))
        if (!matchName && !matchDisease) return false
      }
      return true
    })
  }, [hospitals, selectedDiseaseDropdown, problemSearch])

  // Get on-duty staff for selected condition
  const onDutyStaffForCondition = useMemo(() => {
    return teamMembers.filter(m => {
      if (m.status !== 'active') return false
      if (selectedDiseaseDropdown === 'All') return true
      return m.diseaseSpecialty.includes(selectedDiseaseDropdown) || m.department.includes(selectedDiseaseDropdown)
    })
  }, [teamMembers, selectedDiseaseDropdown])

  // -------------------------------------------------------------
  // PATIENT PRE-REQUEST BOOKING
  // -------------------------------------------------------------
  function handlePatientBooking(e) {
    e.preventDefault()
    if (!patientName.trim() || !patientPhone.trim()) return

    const token = `FLOW-CHM-${Math.floor(1000 + Math.random() * 9000)}`
    const assignedDisease =
      selectedDiseaseDropdown !== 'All'
        ? selectedDiseaseDropdown
        : problemSearch || 'Emergency General Triage'

    // Match appropriate department
    let targetDept = 'Emergency & Pulmonology'
    if (assignedDisease.includes('Heart')) targetDept = 'ICCU / Cardiology'
    else if (assignedDisease.includes('Fever')) targetDept = 'Monsoon Triage Ward'
    else if (assignedDisease.includes('Fracture') || assignedDisease.includes('Trauma')) targetDept = 'Trauma & Orthopedics'
    else if (assignedDisease.includes('Renal') || assignedDisease.includes('Dialysis')) targetDept = 'Nephrology & Dialysis'
    else if (assignedDisease.includes('Child') || assignedDisease.includes('Pediatric')) targetDept = 'Pediatrics Wing'

    const newAllotment = {
      id: token,
      patientName,
      phone: patientPhone,
      disease: assignedDisease,
      department: targetDept,
      bedType: patientBedType,
      hospitalName: selectedHospital.name,
      timeAgo: 'Just now',
      status: 'Awaiting Allotment',
      assignedStaffEmail: null,
      assignedStaffName: null,
    }

    setAllotments(prev => [newAllotment, ...prev])
    setGeneratedToken(token)

    // Decrement bed count
    setHospitals(prev =>
      prev.map(h => {
        if (h.id === selectedHospital.id) {
          return {
            ...h,
            generalBedsFree: Math.max(0, h.generalBedsFree - 1),
            icuBedsFree: patientBedType.includes('ICCU') ? Math.max(0, h.icuBedsFree - 1) : h.icuBedsFree,
          }
        }
        return h
      })
    )

    setPatientName('')
    setPatientPhone('')
  }

  // -------------------------------------------------------------
  // ADMIN ALLOTMENT DISPATCH
  // -------------------------------------------------------------
  function handleConfirmDispatch() {
    if (!dispatchingAllotment) return
    const staff = teamMembers.find(m => m.email === selectedAssigneeEmail)

    setAllotments(prev =>
      prev.map(a =>
        a.id === dispatchingAllotment.id
          ? {
              ...a,
              status: 'Dispatched to Staff',
              assignedStaffEmail: staff ? staff.email : selectedAssigneeEmail,
              assignedStaffName: staff ? staff.name : 'Attending Staff',
            }
          : a
      )
    )

    // Increment staff workload
    setTeamMembers(prev =>
      prev.map(m =>
        m.email === selectedAssigneeEmail ? { ...m, assignedPatients: m.assignedPatients + 1 } : m
      )
    )

    setDispatchingAllotment(null)
  }

  return (
    <div
      style={{
        background: '#0d1f2d',
        minHeight: '100vh',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        margin: '-24px',
        padding: '24px 32px',
      }}
    >
      {/* =========================================================================
          GLOBAL TOP NAVIGATION: UNIFIED ROLE & LOGIN BAR
         ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: '#091520',
          border: '1px solid #162a3b',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '26px',
        }}
      >
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
            <ShieldCheck size={18} />
          </div>
          <div>
            <strong style={{ fontSize: '15px', color: '#ffffff', display: 'block' }}>
              FLOWGUARD NEXUS · HOSPITAL OS
            </strong>
            <span style={{ fontSize: '10px', color: '#14b8a6', fontWeight: 800, letterSpacing: '0.8px' }}>
              CHEMBUR ADMISSION DISPATCH & ROLE ACCESS TERMINAL
            </span>
          </div>
        </div>

        {/* Dynamic Portal Selector & Authentication Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveSession('patient')}
            style={{
              background: activeSession === 'patient' ? '#0d9488' : '#132838',
              color: activeSession === 'patient' ? '#ffffff' : '#94a3b8',
              border: '1px solid #1e3a50',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <HeartPulse size={13} />
            <span>1. Patient / Home Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const admin = teamMembers.find(m => m.role === 'Platform Admin')
              setCurrentUser(admin)
              setActiveSession('admin')
            }}
            style={{
              background: activeSession === 'admin' ? '#0d9488' : '#132838',
              color: activeSession === 'admin' ? '#ffffff' : '#94a3b8',
              border: '1px solid #1e3a50',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={13} />
            <span>2. Hospital Owner (Admin)</span>
            {allotments.filter(a => a.status === 'Awaiting Allotment').length > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 900,
                  padding: '1px 5px',
                  borderRadius: '999px',
                }}
              >
                {allotments.filter(a => a.status === 'Awaiting Allotment').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentUser && currentUser.role !== 'Platform Admin') {
                setActiveSession('staff')
              } else {
                setActiveSession('login')
              }
            }}
            style={{
              background: activeSession === 'staff' || activeSession === 'login' ? '#0d9488' : '#132838',
              color: activeSession === 'staff' || activeSession === 'login' ? '#ffffff' : '#94a3b8',
              border: '1px solid #1e3a50',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <KeyRound size={13} />
            <span>3. Staff Terminal (Login)</span>
          </button>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>
                {currentUser.name} ({currentUser.role})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ef4444',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <LogOut size={11} />
                <span>Exit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          PORTAL 1: PATIENT & CITIZEN HOME DESK
         ========================================================================= */}
      {activeSession === 'patient' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1320px', margin: '0 auto' }}>
          {/* Patient Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #102a3d 0%, #0d1f2d 100%)',
              border: '1px solid #1e3a50',
              borderRadius: '14px',
              padding: '24px 28px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 800, letterSpacing: '1px' }}>
              CHEMBUR RESIDENTIAL INTAKE DESK
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
              Check Chembur Doctor & Bed Availability from Your Home
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Type your symptoms or select a disease category below. We connect you directly with on-duty specialists across Chembur hospitals.
            </p>

            {/* Problem Typing Space + Dropdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.8fr) minmax(260px, 1fr)',
                gap: '12px',
                marginTop: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#091520',
                  border: '1px solid #1e3a50',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  gap: '10px',
                }}
              >
                <Search size={16} color="#2dd4bf" />
                <input
                  type="text"
                  placeholder="Type what you're facing (e.g. chest pressure, 103°F fever, asthma breathlessness, fracture, dialysis)..."
                  value={problemSearch}
                  onChange={e => setProblemSearch(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '13px',
                    width: '100%',
                  }}
                />
              </div>

              <div>
                <select
                  value={selectedDiseaseDropdown}
                  onChange={e => setSelectedDiseaseDropdown(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <option value="All">All 6 Emergency Disease Categories</option>
                  <option value="Heart Attack / Acute Chest Pain">1. Cardiology / Heart Attack / ICCU</option>
                  <option value="Dengue / Malaria / 103°F High Fever">2. Monsoon Fever / Dengue / Malaria</option>
                  <option value="Severe Asthma / Acute Breathlessness">3. Pulmonology / Breathlessness / Asthma</option>
                  <option value="Bone Fractures / Accident Trauma">4. Orthopedics / Bone Trauma / Fractures</option>
                  <option value="Acute Renal Failure / Emergency Dialysis">5. Nephrology / Kidney Dialysis</option>
                  <option value="Child Emergency / High Pediatric Fever">6. Pediatrics / Child Emergency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admission Token Receipt */}
          {generatedToken && (
            <div
              style={{
                background: '#064e3b',
                border: '1px solid #059669',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color="#34d399" />
                <div>
                  <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>
                    Bed Pre-Reservation Sent to Hospital Owner & Staff!
                  </strong>
                  <span style={{ fontSize: '12px', color: '#a7f3d0' }}>
                    Token Issued: <strong>{generatedToken}</strong> · The on-duty team at {selectedHospital.name} has been notified.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeneratedToken(null)}
                style={{
                  background: '#047857',
                  border: 'none',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 2-Column: Live Hospitals with 2 Specialist Staff Per Disease (Left) + Bed Booking Form (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(360px, 1.2fr)', gap: '20px' }}>
            {/* Left Column: Hospital & Specialists View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  Chembur Hospitals Equipped for Your Condition ({filteredHospitals.length})
                </strong>
                <span style={{ fontSize: '11px', color: '#2dd4bf' }}>Select hospital to reserve bed</span>
              </div>

              {filteredHospitals.map(hosp => {
                const isSelected = selectedHospital.id === hosp.id

                return (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    style={{
                      background: isSelected ? '#122638' : '#0c1a27',
                      border: isSelected ? '2px solid #0d9488' : '1px solid #162a3b',
                      borderRadius: '12px',
                      padding: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>
                          {hosp.name}
                        </h3>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{hosp.area}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span
                          style={{
                            background: '#064e3b',
                            color: '#34d399',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {hosp.generalBedsFree} General Beds
                        </span>
                        <span
                          style={{
                            background: '#431407',
                            color: '#fb923c',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {hosp.icuBedsFree} ICCU Beds
                        </span>
                      </div>
                    </div>

                    {/* Specialists On Duty for this Condition */}
                    <div style={{ marginTop: '14px', borderTop: '1px solid #162a3b', paddingTop: '10px' }}>
                      <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                        ON-DUTY CLINICAL SPECIALISTS (DOCTOR & NURSE PAIR):
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {teamMembers
                          .filter(m => m.status === 'active' && m.role !== 'Platform Admin')
                          .slice(0, 4)
                          .map(staff => (
                            <div
                              key={staff.id}
                              style={{
                                background: '#091520',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                              }}
                            >
                              <strong style={{ color: '#ffffff', display: 'block' }}>{staff.name}</strong>
                              <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block' }}>
                                {staff.designation}
                              </span>
                              <span style={{ color: '#34d399', fontSize: '10px', fontWeight: 700 }}>
                                ● {staff.department}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column: Pre-Registration & Bed Request Form */}
            <div
              style={{
                background: '#0c1a27',
                border: '1px solid #162a3b',
                borderRadius: '12px',
                padding: '22px',
                height: 'fit-content',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', color: '#0d9488', fontWeight: 800, letterSpacing: '0.8px' }}>
                  STEP 2: PRE-ADMISSION FORM
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '4px 0 2px 0' }}>
                  Reserve at {selectedHospital.name}
                </h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Notifies the hospital owner and assigns the designated clinical staff immediately.
                </span>
              </div>

              <form onSubmit={handlePatientBooking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Patil"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#091520',
                      border: '1px solid #1e3a50',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Contact Number (For Admission Token) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98200 12345"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#091520',
                      border: '1px solid #1e3a50',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Bed Type Needed
                  </label>
                  <select
                    value={patientBedType}
                    onChange={e => setPatientBedType(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#091520',
                      border: '1px solid #1e3a50',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  >
                    <option value="ICCU Bed">ICCU Bed (Cardiac / Critical Care)</option>
                    <option value="Emergency Triage Bed">Emergency Triage Observation Bed</option>
                    <option value="General Ward (Oxygen)">General Ward (Oxygen-Supported)</option>
                    <option value="Pediatric Observation Bed">Pediatric Observation Bed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#0d9488',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={14} />
                  <span>Transmit Pre-Request to Hospital Owner</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PORTAL 2: STAFF LOGIN & REGISTRATION GATE
         ========================================================================= */}
      {activeSession === 'login' && (
        <div style={{ maxWidth: '440px', margin: '40px auto' }}>
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #162a3b',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  color: '#ffffff',
                }}
              >
                <KeyRound size={22} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px 0' }}>
                Staff Authentication
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Enter your registered hospital email to access your department terminal.
              </span>
            </div>

            {loginError && (
              <div
                style={{
                  background: '#451a03',
                  border: '1px solid #78350f',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  color: '#fef08a',
                  marginBottom: '16px',
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Staff Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. srishti.jain@surana.in or dr.mehta@surana.in"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#0d9488',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <LogIn size={14} />
                <span>Verify Email & Log In</span>
              </button>
            </form>

            {/* Quick Demo Staff Logins */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #162a3b', paddingTop: '16px' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                QUICK 1-CLICK DEMO LOGINS:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const doc = teamMembers.find(m => m.email === 'dr.mehta@surana.in')
                    setCurrentUser(doc)
                    setActiveSession('staff')
                  }}
                  style={{
                    background: '#132838',
                    border: '1px solid #1e3a50',
                    color: '#e2e8f0',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  👨‍⚕️ <strong>Dr. Rajesh Mehta</strong> (ICCU / Cardiology)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nurse = teamMembers.find(m => m.email === 'srishti.jain@surana.in')
                    setCurrentUser(nurse)
                    setActiveSession('staff')
                  }}
                  style={{
                    background: '#132838',
                    border: '1px solid #1e3a50',
                    color: '#e2e8f0',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  👩‍⚕️ <strong>Dr. Srishti Jain</strong> (Emergency & Pulmonology)
                </button>
              </div>

              {/* Self-registration link if not added by owner */}
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  style={{ background: 'transparent', border: 'none', color: '#2dd4bf', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Not added by owner yet? Submit registration request →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PORTAL 3: SCOPED STAFF VIEW (POST-LOGIN)
          Shows Hospital Name, Department Isolation, and Assigned Patients Only
         ========================================================================= */}
      {activeSession === 'staff' && currentUser && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Banner: Hospital Name + Staff Name */}
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #162a3b',
              borderRadius: '14px',
              padding: '24px 28px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, letterSpacing: '1px' }}>
              STAFF TERMINAL · ACCESS AUTHENTICATED
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '4px 0 2px 0' }}>
              {currentUser.hospitalName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <strong style={{ fontSize: '14px', color: '#2dd4bf' }}>Logged In: {currentUser.name}</strong>
              <span style={{ color: '#64748b' }}>·</span>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{currentUser.designation}</span>
              <span style={{ color: '#64748b' }}>·</span>
              <span
                style={{
                  background: '#064e3b',
                  color: '#34d399',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Dept: {currentUser.department}
              </span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Department Isolation Active: You only have access to {currentUser.department} patients. All other departmental records are protected and restricted.
            </p>
          </div>

          {/* Assigned Patients Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Your Department Patient Admissions Queue:
            </h3>

            {allotments.filter(
              a =>
                a.assignedStaffEmail === currentUser.email ||
                a.department.toLowerCase().includes(currentUser.department.toLowerCase())
            ).length === 0 ? (
              <div style={{ background: '#0c1a27', border: '1px solid #162a3b', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                No active patients dispatched to {currentUser.department} right now.
              </div>
            ) : (
              allotments
                .filter(
                  a =>
                    a.assignedStaffEmail === currentUser.email ||
                    a.department.toLowerCase().includes(currentUser.department.toLowerCase())
                )
                .map(patient => (
                  <div
                    key={patient.id}
                    style={{
                      background: '#0c1a27',
                      border: '1px solid #0d9488',
                      borderRadius: '12px',
                      padding: '18px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '15px', color: '#ffffff' }}>{patient.patientName}</strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>({patient.phone})</span>
                        <span style={{ fontSize: '11px', color: '#2dd4bf', fontWeight: 700 }}>
                          Token: {patient.id}
                        </span>
                        <span
                          style={{
                            background: patient.status.includes('Ready') ? '#064e3b' : '#78350f',
                            color: patient.status.includes('Ready') ? '#34d399' : '#fde047',
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {patient.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                        Need: <strong style={{ color: '#ffffff' }}>{patient.disease}</strong> · Bed:{' '}
                        <strong>{patient.bedType}</strong> · Dept: <strong>{patient.department}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAllotments(prev =>
                          prev.map(a =>
                            a.id === patient.id ? { ...a, status: 'Bed Ready & Admitted' } : a
                          )
                        )
                        alert(`Bed prepared and confirmed for ${patient.patientName}.`)
                      }}
                      style={{
                        background: '#0d9488',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Bed Prep & Admission
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PORTAL 4: HOSPITAL OWNER / ADMIN (MATCHED TO SCREENSHOTS)
         ========================================================================= */}
      {activeSession === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1360px', margin: '0 auto' }}>
          {/* Welcome Banner matching screenshot 7 & 9 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#2dd4bf', fontWeight: 800, letterSpacing: '1px' }}>
                WELCOME BACK
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: '2px 0 4px 0' }}>
                POPTANI.[cite: 7, 9, 13]
              </h1>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Your Nexus journey so far — {hospitals.length} hospital networks listed.[cite: 7, 9, 13]
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddStaffModal(true)}
              style={{
                background: '#132838',
                border: '1px dashed #0d9488',
                color: '#2dd4bf',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <UserPlus size={14} />
              <span>Add Staff by Email</span>
            </button>
          </div>

          {/* Section: Incoming Pre-Requests Awaiting Staff Allotment */}
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #162a3b',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Incoming Patient Allotments & Pre-Requests
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                {allotments.filter(a => a.status === 'Awaiting Allotment').length} Action Required
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allotments.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: '#091520',
                    border: item.status === 'Awaiting Allotment' ? '1px solid #78350f' : '1px solid #162a3b',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#ffffff' }}>{item.patientName}</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>({item.phone})</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: item.status === 'Awaiting Allotment' ? '#78350f' : '#064e3b',
                          color: item.status === 'Awaiting Allotment' ? '#fde047' : '#34d399',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      Disease: <strong style={{ color: '#ffffff' }}>{item.disease}</strong> · Bed:{' '}
                      <strong style={{ color: '#ffffff' }}>{item.bedType}</strong> · Token:{' '}
                      <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{item.id}</span>
                    </div>

                    {item.assignedStaffName && (
                      <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
                        ✓ Dispatched to: <strong>{item.assignedStaffName}</strong> ({item.department})
                      </div>
                    )}
                  </div>

                  {item.status === 'Awaiting Allotment' ? (
                    <button
                      type="button"
                      onClick={() => setDispatchingAllotment(item)}
                      style={{
                        background: '#0d9488',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Assign to Department Staff →
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>Dispatched</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot 8: Team & Roles Main Title */}
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px 0' }}>
              Team & Roles[cite: 8, 12]
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Add team members by email, manage everyone&apos;s access, and review public applications.[cite: 8, 12]
            </p>
          </div>

          {/* 6 Metric Cards matching Screenshot 8 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Total Team[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#ffffff' }}>{teamMembers.length}</strong>[cite: 8, 12]
            </div>

            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Active[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#ffffff' }}>
                {teamMembers.filter(m => m.status === 'active').length}
              </strong>[cite: 8, 12]
            </div>

            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Suspended[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#eab308' }}>0</strong>[cite: 8, 12]
            </div>

            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Calling Access[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#ffffff' }}>
                {teamMembers.filter(m => m.callingAccess).length}
              </strong>[cite: 8, 12]
            </div>

            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Admins[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#ffffff' }}>1</strong>[cite: 8, 12]
            </div>

            <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Active in Last 7 Days[cite: 8, 12]</span>
              <strong style={{ fontSize: '28px', color: '#22c55e' }}>{teamMembers.length - 1}</strong>[cite: 8, 12]
            </div>
          </div>

          {/* Screenshot 10 & 11: ACTIVE Roster Table with 2 Staff per Disease */}
          <div style={{ background: '#0c1a27', border: '1px solid #162a3b', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>
              ACTIVE CLINICAL STAFF ROSTER (2 STAFF PER DISEASE CATEGORY)[cite: 10, 11]
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {teamMembers
                .filter(m => m.status === 'active')
                .map(member => (
                  <div
                    key={member.id}
                    style={{
                      background: '#091520',
                      border: '1px solid #162a3b',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '14px', color: '#ffffff' }}>{member.name}</strong>[cite: 10, 11]
                        <span style={{ fontSize: '11px', color: '#2dd4bf' }}>{member.designation}</span>[cite: 10, 11]
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: '#064e3b',
                            color: '#34d399',
                            border: '1px solid #059669',
                          }}
                        >
                          {member.lastActive}[cite: 10, 11]
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Phone size={12} color="#64748b" />
                        <Mail size={12} color="#64748b" />
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{member.email}</span>
                      </div>

                      {/* Department & Specialty Pills */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: '#132838',
                            color: '#e2e8f0',
                            border: '1px solid #1e3a50',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {member.department}[cite: 10, 11]
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: '#132838',
                            color: '#2dd4bf',
                            border: '1px solid #0d9488',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          Specialty: {member.diseaseSpecialty}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: '#091520',
                            color: '#eab308',
                            border: '1px solid #854d0e',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {member.assignedPatients} Patients Assigned
                        </span>
                      </div>
                    </div>

                    {/* Role Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <select
                        value={member.role}
                        onChange={e => {
                          const newRole = e.target.value
                          setTeamMembers(prev =>
                            prev.map(m => (m.id === member.id ? { ...m, role: newRole } : m))
                          )
                        }}
                        style={{
                          background: '#132838',
                          color: '#ffffff',
                          border: '1px solid #1e3a50',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        <option value="Platform Admin">Platform Admin[cite: 10, 11]</option>
                        <option value="Department Lead">Department Lead</option>
                        <option value="Attending Doctor">Attending Doctor</option>
                        <option value="Staff Nurse">Staff Nurse</option>
                      </select>

                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {member.callingAccess ? 'Calling Active' : 'No Calling'}[cite: 10, 11]
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pending Applicants / Signups matching Screenshot 8 */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #162a3b', paddingTop: '16px' }}>
              <span style={{ fontSize: '10px', color: '#eab308', fontWeight: 800, letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                PENDING — HASN&apos;T SIGNED UP YET / AWAITING OWNER APPROVAL[cite: 8, 12]
              </span>

              {teamMembers
                .filter(m => m.status === 'pending')
                .map(pendingMember => (
                  <div
                    key={pendingMember.id}
                    style={{
                      background: '#091520',
                      border: '1px solid #78350f',
                      borderRadius: '8px',
                      padding: '12px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: '#ffffff' }}>{pendingMember.name}[cite: 8, 12]</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>
                        {pendingMember.email} · {pendingMember.designation}[cite: 8, 12]
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#713f12',
                          color: '#fef08a',
                        }}
                      >
                        pending[cite: 8, 12]
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTeamMembers(prev =>
                            prev.map(m => (m.id === pendingMember.id ? { ...m, status: 'active' } : m))
                          )
                        }}
                        style={{
                          background: '#0d9488',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Approve Access[cite: 8, 12]
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ALLOT WORK TO CLINICAL STAFF (OWNER ACTION)
         ========================================================================= */}
      {dispatchingAllotment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9,21,32,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #0d9488',
              borderRadius: '14px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <strong style={{ fontSize: '16px', color: '#ffffff' }}>Dispatch Bed Allotment to Staff</strong>
              <button
                type="button"
                onClick={() => setDispatchingAllotment(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#091520', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
              <div>Patient: <strong>{dispatchingAllotment.patientName}</strong></div>
              <div>Disease: <span style={{ color: '#2dd4bf' }}>{dispatchingAllotment.disease}</span></div>
              <div>Bed Category: {dispatchingAllotment.bedType}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Select On-Duty Staff Member in {dispatchingAllotment.department}
                </label>
                <select
                  value={selectedAssigneeEmail}
                  onChange={e => setSelectedAssigneeEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  {teamMembers
                    .filter(m => m.status === 'active' && m.role !== 'Platform Admin')
                    .map(m => (
                      <option key={m.id} value={m.email}>
                        {m.name} ({m.designation} · {m.department})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setDispatchingAllotment(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #1e3a50',
                  color: '#94a3b8',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                style={{
                  background: '#0d9488',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD STAFF BY EMAIL (OWNER ACTION)
         ========================================================================= */}
      {showAddStaffModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9,21,32,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #0d9488',
              borderRadius: '14px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <strong style={{ fontSize: '16px', color: '#ffffff' }}>Add Staff Member by Email</strong>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                if (!newStaffEmail.trim() || !newStaffName.trim()) return
                const newMember = {
                  id: `staff-${Date.now()}`,
                  name: newStaffName,
                  email: newStaffEmail.toLowerCase().trim(),
                  phone: '+91 98200 00000',
                  designation: `${newStaffRole} (${newStaffDept})`,
                  role: newStaffRole,
                  department: newStaffDept,
                  diseaseSpecialty: newStaffDept,
                  hospitalName: 'Surana Sethia Medical Centre',
                  status: 'active',
                  lastActive: 'Active today',
                  assignedPatients: 0,
                  callingAccess: true,
                }
                setTeamMembers(prev => [newMember, ...prev])
                setShowAddStaffModal(false)
                setNewStaffName('')
                setNewStaffEmail('')
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Full Staff Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Kavita Nair"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Staff Email Address (For Login Authentication) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kavita.nair@surana.in"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Assign Department
                </label>
                <select
                  value={newStaffDept}
                  onChange={e => setNewStaffDept(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  <option value="ICCU / Cardiology">ICCU / Cardiology</option>
                  <option value="Monsoon Triage Ward">Monsoon Triage Ward</option>
                  <option value="Emergency & Pulmonology">Emergency & Pulmonology</option>
                  <option value="Trauma & Orthopedics">Trauma & Orthopedics</option>
                  <option value="Nephrology & Dialysis">Nephrology & Dialysis</option>
                  <option value="Pediatrics Wing">Pediatrics Wing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Staff Role
                </label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  <option value="Attending Doctor">Attending Doctor</option>
                  <option value="Staff Nurse">Staff Nurse</option>
                  <option value="Department Lead">Department Lead</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1e3a50',
                    color: '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#0d9488',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Add to Active Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: STAFF SELF-REGISTRATION REQUEST
         ========================================================================= */}
      {showRegisterModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9,21,32,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0c1a27',
              border: '1px solid #0d9488',
              borderRadius: '14px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <strong style={{ fontSize: '16px', color: '#ffffff' }}>Submit Staff Registration Request</strong>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStaffSelfRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amit Sharma"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Your Hospital Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. amit.sharma@surana.in"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Target Department
                </label>
                <select
                  value={regDept}
                  onChange={e => setRegDept(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#091520',
                    border: '1px solid #1e3a50',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  <option value="ICCU / Cardiology">ICCU / Cardiology</option>
                  <option value="Monsoon Triage Ward">Monsoon Triage Ward</option>
                  <option value="Emergency & Pulmonology">Emergency & Pulmonology</option>
                  <option value="Trauma & Orthopedics">Trauma & Orthopedics</option>
                  <option value="Nephrology & Dialysis">Nephrology & Dialysis</option>
                  <option value="Pediatrics Wing">Pediatrics Wing</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1e3a50',
                    color: '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#0d9488',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}