import { useEffect, useState } from 'react'
import axios from 'axios';
import { EllipsisVertical, Phone, Laptop, Mail} from 'lucide-react'
const InActiveEmployees = ( {search}) => {
  const [empCard, setEmpCard] = useState([]);
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [openMenu, setOpenMenu] = useState(null)
  const filterEmployee = empCard.filter((emp) => 
    emp.isActive === false && (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) 
    )
  )
  const toggleStatus = async(empId)=>{
    try{

      const token = localStorage.getItem("token")
      const res = await axios.patch(
        `http://localhost:3000/api/admin/employee/${empId}/status`,
        {},
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      alert(res.data.message)
      setEmpCard(prev =>
        prev.map(emp =>
          emp.empId === empId
          ? {...emp,isActive:!emp.isActive}
          : emp
        )
      )
      setOpenMenu(null)

    }catch(err){
      console.log(err)
    }

  }
  useEffect(() =>{
      const countEmp = async ()=>{
        try{
          const token = localStorage.getItem('token')
  
          const response = await axios.get(`http://localhost:3000/api/admin/employees?page=${index}&limit=9`,
            {
              headers:{
                Authorization: `Bearer ${token}`
              }
            }
          )
          setTimeout(() => {
            setEmpCard(response.data.employees)
            setTotalPages(response.data.totalPages);
            setLoading(false)
        
          }, 1000/2);
        }catch(err){
          console.log(err);
          
        }
      }
      countEmp()
    },[index])
    if(loading){
    return <div className=" bg-black flex items-center justify-center">

      <h3 className=" text-gray-400 absolute top-1/2 left-2/3 ml-[-50px] -translate-x-1/2 -translate-y-1/2">
      Loading...
    </h3>
    </div>
  }
  return (
    <div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-5 px-2'>
        {
          filterEmployee.length > 0 ? (
            filterEmployee.map((emp) => (
            <div key={emp._id} className='rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.20)] h-fit p-4 space-y-2'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-3'>
                  <p className='text-gray-400'>{emp.empId}</p>
                  <div className={`h-4 w-4  flex justify-center items-center p- rounded-full border-2 ${ 
                    emp.isActive
                    ? "bg-green-400/10 border-green-600"
                    : "bg-red-400/10 border-red-600"
                  } `}>
                  <h1 className={`h-2 w-2  rounded-full ${
                    emp.isActive 
                    ? "bg-green-400/60"
                    : "bg-red-400/60"
                  }`}></h1>
                  </div>
                </div>
                <div className="relative">

                  <div
                    onClick={() =>
                      setOpenMenu(openMenu === emp._id ? null : emp._id)
                    }
                    className="hover:bg-gray-300 flex items-center justify-center cursor-pointer w-6 h-6 rounded-full"
                  >
                    <EllipsisVertical size={18} />
                  </div>


                  {
                    openMenu === emp._id && (
                      <div className="absolute right-0 top-8 bg-white shadow-lg border rounded-lg w-36 z-50">

                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={()=>{
                            console.log("Edit", emp.empId)
                          }}
                        >
                          Edit Details
                        </button>


                        <button
                          className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50"
                          onClick={()=>toggleStatus(emp.empId)}
                        >
                          {
                            emp.isActive 
                            ? "Deactivate"
                            : "Activate"
                          }
                        </button>

                      </div>
                    )
                  }

                </div>
                </div>
              <p className={`${emp.role === "Manager" 
              ? "text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-2xl border border-green-400"
            : "text-orange-500 bg-orange-500/10 w-fit px-2 py-1 rounded-2xl border border-orange-400"} text-sm `}>
              {emp.role}</p>
              <h1 className='font-semibold text-2xl text-blue-500'>{emp.name}</h1>
              <hr />

              <div className='flex items-center gap-3'>
                <div className='border-2 bg-blue-400/20 p-2 border-blue-400 rounded'>
                  <Phone className=' text-blue-500' 
                  size={18}/>

                </div>
                <div>
                  <p className='text-gray-400 text-sm'> Phone Number</p>
                  <p className='font-semibold'> {emp.number}</p>
                </div>

              </div>
              <div className='flex items-center gap-3'>
                <div className='border-2 bg-violet-400/20 p-2 border-violet-400 rounded'>
                  <Laptop className=' text-violet-500' 
                  size={18}/>

                </div>
                <div>
                  <p className='text-gray-400 text-sm'>Departmentr</p>
                  <p className='font-semibold'> {emp.department}</p>
                </div>

              </div>
              <div className='flex items-center gap-3'>
                <div className='border-2 bg-red-400/20 p-2 border-red-400 rounded'>
                  <Mail className=' text-red-500' 
                  size={18}/>

                </div>
                <div>
                  <p className='text-gray-400 text-sm'>Mail</p>
                  <p className='font-semibold'> {emp.email}</p>
                </div>

              </div>
              
            </div>
          ))
        ) : (
          <div className=' col-span-full flex w-full justify-center text-red-500 font-semibold text-2xl'>
          Employee Not Found
          </div>
        )
        
      }
        
      </div>
        <div className='flex relative bottom-0 justify-center items-center gap-5 p-5'>
          <button className='bg-amber-400 px-3 py-2 active:scale-95 rounded-lg cursor-pointer font-semibold text-black'
          disabled={index === 1}
          onClick={()=>{
              setIndex((prev) => prev - 1)
              setLoading(true)
              
            }}
            >Prev</button>

          <h2 className='text-center border-[2px]  border-gray-300 w-10  text-black font-semibold p-2'>{index}</h2>
          <button className='bg-amber-400 px-3 py-2 active:scale-95 rounded-lg cursor-pointer font-semibold text-black'
          disabled={empCard.length <= totalPages}
          onClick={()=>{
            
            setIndex((prev) => prev + 1)
            setLoading(true)
          }}
          >Next</button>
        </div>
    </div>
  )
}

export default InActiveEmployees
