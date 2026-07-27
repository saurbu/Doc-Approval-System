import React, { useEffect, useState } from 'react'
import { ShieldUser} from 'lucide-react'
import axios from 'axios'

const Home = () => {

  const [allEmp, setAllEmp] = useState("0");
  const [isActive, setIsActive] = useState("0");

  useEffect(() =>{
    const countEmp = async ()=>{
      try{
        const token = localStorage.getItem('token')

        const response = await axios.get("http://localhost:3000/api/admin/employees",
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        )
        
        const employees = response.data.employees

        const active = employees.filter(emp => emp.isActive).length
        setAllEmp(response.data.count)
        setIsActive(active)
      }catch(err){
        console.log(err);
        

      }
    }
    countEmp()
  },[])

  return (
    <div className='ml-3 p-3 h-[94vh]  rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.35)]'>
      <div className='flex justify-between p-3 px-5'>
        <h1 className='text-xl font-semibold'>Welcome, back...</h1>
        <div className='flex gap-1 items-center border px-3 py-1 rounded text-lg font-semibold hover:text-red-480 hover:bg-gray-100 cursor-pointer '>
          <ShieldUser size={20} className='text-green-400'/>
          <h1>Admin</h1>
        </div>
      </div>

      <div className='grid grid-cols-5 p-4 gap-2'>
        <div className='w-50 h-30 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-5'>
          <h1 className='text-lg text-blue-500 font-bold'> All Employees</h1>
          <h1 className='text-5xl text-purple-400'>{allEmp}</h1>
        </div>
        <div className='w-50 h-30 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-5'>
          <h1 className='text-lg text-blue-500 font-bold'> Active Employees</h1>
          <h1 className='text-5xl text-green-500'>{isActive}</h1>
        </div>
        <div className='w-50 h-30 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-5'>
          <h1 className='text-lg text-blue-500 font-bold'> All Documents</h1>
          <h1 className='text-5xl text-red-400'>0</h1>
        </div>
        <div className='w-50 h-30 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-5'>
          <h1 className='text-[17px] text-blue-500 font-bold'>Pending Document</h1>
          <h1 className='text-5xl text-orange-400'>0</h1>
        </div>
        <div className='w-50 h-30 shadow-[0_0_20px_rgba(0,0,0,0.18)] rounded-xl p-5'>
          <h1 className='text-[16px] text-blue-500 font-bold'>Approved Document</h1>
          <h1 className='text-5xl text-green-400'>0</h1>
        </div>


      </div>
    </div>
  )
}

export default Home
 