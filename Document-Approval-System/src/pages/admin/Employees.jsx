import React, { useState } from 'react'
import {Search} from 'lucide-react'
import AllEmployees from './AllEmployees'
import ActiveEmployees from './ActiveEmployees'
import InActiveEmployees from './InActiveEmployees'



const Employees = () => {
  const [activePage, setActivePage] = useState("all");
  const [search, setSearch] = useState('')
  const menuEmp = (page) => {
    const base = "px-2 py-1 w-30 rounded-2xl cursor-pointer transition"
    if(activePage !== page){
      return `${base} hover:bg-blue-500/10 px-2 w-30 py-1 rounded-2xl hover:border-blue-400 hover:border-1`
    }
    switch(page){
      case "all" :
        return `${base} bg-blue-500/10 px-2 py-1 w-30 rounded-2xl border-blue-400 border-1`
      case "active" :
        return `${base} bg-green-500/10 px-2 py-1 w-30 rounded-2xl border-green-400 border-1`
      case "inactive" :
        return `${base} bg-red-500/10 px-2 py-1 w-30 rounded-2xl border-red-400 border-1`
    }
     
    // ?'bg-blue-500/10 px-2 py-1 w-30 rounded-2xl border-blue-400 border-1'
    // :'hover:bg-blue-500/10 px-2 w-30 py-1 rounded-2xl hover:border-blue-400 hover:border-1'
  }
  
    
  return (
    <div className=' ml-3 shadow-[0_0_20px_rgba(0,0,0,0.35)] h-[94vh] rounded-xl overflow-y-auto scrollbar-none'>
      <div className='h-15 px-2 w-full shadow-xl rounded sticky top-0 bg-black/30 flex justify-between items-center'>
        <h1 className='text-2xl p-2 font-semibold hidden lg:block'>Employees</h1>
        <div className='flex items-center justify-between h-10 w-[500px] bg-gray-200 rounded-2xl overflow-hidden'>
        <input 
        type="text" 
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        className='w-[450px]  outline-none p-2 px-5'
        placeholder='Search by Name, Employee Id and Role'
        />
        <p className='bg-violet-500 w-15 flex justify-center cursor-pointer p-2  '><Search /></p>

        </div>
      </div>
        <div className='p-5 flex justify-center gap-10 '>
          <button 
          onClick={() => setActivePage("all")}
          className={menuEmp("all")}
          >All
          </button>
          <button
          onClick={() => setActivePage("active")}
          className={menuEmp("active")}
          >Active</button>
          <button
          onClick={() => setActivePage("inactive")}
          className={menuEmp("inactive")}
          >Inactive</button>
        </div>

        <div className="ml-[10px]  flex-1">
          {activePage === "all" && <AllEmployees search={search}/>}
          {activePage === "active" && <ActiveEmployees search={search}/>}
          {activePage === "inactive" && <InActiveEmployees search={search}/>}
        </div>
    </div>
  )
}

export default Employees
