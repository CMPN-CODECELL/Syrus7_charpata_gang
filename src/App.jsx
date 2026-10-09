import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Overview from './pages/overview'
import PatientFlow from './pages/PatientFlow'
import ResourcesStaff from './pages/ResourcesStaff'
import CascadeImpact from './pages/CascadeImpact'
import Alerts from './pages/Alerts'
import Sustainability from './pages/Sustainability'
import MumbaiSurveillance from './pages/MumbaiSurveillance'
import FindHospital from './pages/FindHospital'
import Departments from './pages/Departments'
import Recommendations from './pages/Recommendations'
import CommandCentre from './pages/CommandCentre'
import WhatIf from './pages/WhatIf'
import BottleneckMap from './pages/BottleneckMap'
import Reports from './pages/Reports'
import Predictions from './pages/Predictions'
import DesignSystem from './pages/DesignSystem'
import HospitalOSNexus from './pages/HospitalOSNexus'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Overview />} />
          <Route path="patient-flow" element={<PatientFlow />} />
          <Route path="resources-staff" element={<ResourcesStaff />} />
          <Route path="command-centre" element={<CommandCentre />} />
          <Route path="departments" element={<Departments />} />
          <Route path="view-panels" element={<Departments />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="cascade-impact" element={<BottleneckMap />} />
          <Route path="bottleneck-map" element={<BottleneckMap />} />
          <Route path="what-if" element={<WhatIf />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="mumbai-surveillance" element={<MumbaiSurveillance />} />
          <Route path="find-hospital" element={<FindHospital />} />
          <Route path="design-system" element={<DesignSystem />} />
          <Route path="sustainability" element={<Sustainability />} />
          <Route path="nexus" element={<HospitalOSNexus />} />
          <Route path="team-roles" element={<HospitalOSNexus />} />
          <Route path="allotments" element={<HospitalOSNexus />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}