import { useState} from 'react'
import Sidebar from '../../components/common/Sidebar'
import Employees from './Employees'
import AddEmployee from './AddEmployee'
import Home from './Home'
import Profile from './Profile'
import Navbar from '../../components/common/Navbar'


const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className='md:p-5 '>
      <Sidebar 
      activePage={activePage}
      setActivePage={setActivePage}
      />
      <Navbar 
      activePage={activePage}
      setActivePage={setActivePage}
      />
<div className="md:ml-[220px] md:w-[calc(100vw-220px)] md:h-screen p-3 overflow-hidden flex flex-col items-center justify-start">        {activePage === "home" && <Home />}
        {activePage === "employees" && <Employees />}
        {/* {activePage === "documents" && <Documents />} */}
        {activePage === "addEmployee" && <AddEmployee />}
        {activePage === "profile" && <Profile />}
        {activePage === "setting" && <Settings />}
      </div>
    </div>
  )
}

export default AdminDashboard