import { useState} from 'react'
import Sidebar from '../../components/common/Sidebar'
import Employees from './Employees'
import AddEmployee from './AddEmployee'
import Home from './Home'
import Profile from './Profile'
import Settings from './Settings'


const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className='p-5'>
      <Sidebar 
      activePage={activePage}
      setActivePage={setActivePage}
      />
      <div className="ml-[260px]  flex-1">
        {activePage === "home" && <Home />}
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