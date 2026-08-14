import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Employees from './Employees'
import AddEmployee from './AddEmployee'
import Home from './Home'
import Profile from './Profile'

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main className="transition-all duration-300 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {activePage === "home" && <Home setActivePage={setActivePage} />}
          {activePage === "employees" && <Employees />}
          {/* {activePage === "documents" && <Documents />} */}
          {activePage === "addEmployee" && <AddEmployee />}
          {activePage === "profile" && <Profile />}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard