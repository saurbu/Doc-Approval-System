import React, { useEffect, useState } from 'react'
import { ShieldUser, LogOut} from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [allEmp, setAllEmp] = useState(0);
  const [isActive, setIsActive] = useState(0)
    const [menuOpen, setMenuOpen]=useState(false)

  useEffect(() =>{
    const countEmp = async ()=>{
      try{
        const token = localStorage.getItem('token')
        const response = await axios.get(
          "http://localhost:3000/api/admin/employee-stats",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )
        setAllEmp(response.data.totalEmployees)
        setIsActive(response.data.activeEmployees)
      }catch(err){
        console.log(err)
      }
    }
    countEmp()
  },[])
  const handleLogout = ()=>{
        localStorage.removeItem('token')
        navigate('/', {replace: true})
    }
  
  return (
    <div className='ml-3 md:p-3 h-[94vh] rounded-xl md:shadow-[0_0_20px_rgba(0,0,0,0.35)]'>
      <div className='flex justify-between p-3 px-5'>
        <h1 className='text-xl font-semibold'>Welcome, back...</h1>
        <div className='flex gap-1 items-center border px-3 py-1 rounded text-lg font-semibold hover:text-red-480 hover:bg-gray-100 cursor-pointer '>
          <ShieldUser size={20} className='text-green-400'/>
          <h1
          onClick={() => setMenuOpen(!menuOpen)}
          >Admin</h1>
          {menuOpen && (
            <div className='md:hidden flex gap-2 justify-center items-center absolute top-18 right-7 bg-red-500 text-white font-semibold p-1 px-3 rounded'
            onClick={handleLogout}
            ><LogOut size={20} /> Logout</div>
          )
          }
        </div>
      </div>

      <div className='flex  p-4 gap-5 justify-center'>
        <div className='md:w-50 w-40 md:h-30 h-25 shadow-[0_0_20px_rgba(0,0,0,0.18)] flex flex-col frex-wrap rounded-xl p-3'
        >
          <h1 className='md:text-lg text-md text-blue-500 font-bold'> All Employees</h1>
          <h1 className='md:text-5xl text-4xl text-purple-400'>{allEmp}</h1>
        </div>
        <div className='md:w-50 w-40 md:h-30 h-25 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-3'>
          <h1 className='md:text-lg text-md text-blue-500 font-bold'> Active Employees</h1>
          <h1 className=' md:text-5xl text-4xl text-green-500'>{isActive}</h1>
        </div>
        <div className='md:w-50 w-40 md:h-30 h-25 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-3'>
          <h1 className='md:text-lg text-md text-blue-500 font-bold'> All Documents</h1>
          <h1 className='md:text-5xl text-4xl text-red-400'>0</h1>
        </div>
        <div className='md:w-50 w-40 md:h-30 h-25 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-3'>
          <h1 className='md:text-[19px] text-[15px] text-blue-500 font-bold'>Pending Document</h1>
          <h1 className='md:text-5xl text-4xl text-orange-400'>0</h1>
        </div>
        <div className='md:w-50 w-40 md:h-30 hidden md:block h-25 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-3'>
          <h1 className='md:text-[17px] text-[14px] text-blue-500 font-bold'>Approved Document</h1>
          <h1 className='md:text-5xl text-4xl text-green-400'>0</h1>
        </div>


      </div>
    </div>
  )
}

export default Home
 