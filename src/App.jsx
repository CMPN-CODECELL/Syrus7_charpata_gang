import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/appshell'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Overview />} />
          <Route path="patient-flow" element={<PatientFlow />} />
          <Route path="resources-staff" element={<ResourcesStaff />} />
          <Route path="cascade-impact" element={<CascadeImpact />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="sustainability" element={<Sustainability />} />
          <Route path="mumbai-surveillance" element={<MumbaiSurveillance />} />
          <Route path="find-hospital" element={<FindHospital />} />
          <Route path="departments" element={<Departments />} />
          <Route path="view-panels" element={<Departments />} />
          <Route path="recommendations" element={<Recommendations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}