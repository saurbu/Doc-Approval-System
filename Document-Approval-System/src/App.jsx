import React from 'react'
import { Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ProtectedRoute from './pages/admin/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />  
        <Route path='/employee/dashboard' element={<EmployeeDashboard/>} />
        <Route path='/manager/dashboard' element={<ManagerDashboard/>} />
      </Route>
    </Routes>
  )
}

export default App
