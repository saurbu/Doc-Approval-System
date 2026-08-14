import { useEffect, useState } from 'react'
import axios from 'axios';
import { MoreVertical, Phone, Building2, Mail, ChevronLeft, ChevronRight, UserCheck, ShieldAlert, Edit2, Power } from 'lucide-react'

const ActiveEmployees = ({ search }) => {
  const [empCard, setEmpCard] = useState([]);
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState(null)
  const [index, setIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const filterEmployee = empCard.filter((emp) => 
    emp.isActive && (
      (emp.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.empId || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(search.toLowerCase())
    )
  )

  const toggleStatus = async (empId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:3000/api/admin/employee/${empId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setEmpCard(prev =>
        prev.map(emp =>
          emp.empId === empId
            ? { ...emp, isActive: !emp.isActive }
            : emp
        )
      )
      setOpenMenu(null)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const countEmp = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:3000/api/admin/employees?page=${index}&limit=9`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setEmpCard(response.data.employees || [])
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }
    countEmp()
  }, [index])

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading active staff members...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filterEmployee.length > 0 ? (
          filterEmployee.map((emp) => (
            <div 
              key={emp._id} 
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between relative"
            >
              <div>
                {/* Header ID & Status Menu */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    {emp.empId}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>

                    {/* Action Dropdown Toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === emp._id ? null : emp._id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenu === emp._id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setOpenMenu(null)} 
                          />
                          <div className="absolute right-0 top-7 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-fadeIn">
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                              onClick={() => {
                                console.log("Edit", emp.empId);
                                setOpenMenu(null);
                              }}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Edit Member</span>
                            </button>
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              onClick={() => toggleStatus(emp.empId)}
                            >
                              <Power className="w-3.5 h-3.5 text-rose-500" />
                              <span>Deactivate Member</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="mt-4 mb-4">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{emp.name}</h3>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                    emp.role === "Manager"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}>
                    {emp.role}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{emp.number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{emp.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{emp.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-slate-700">No active employees found</h4>
            <p className="text-xs text-slate-400 mt-1">There are no active team members matching your current filter.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{index}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={index === 1}
              onClick={() => {
                setIndex((prev) => Math.max(prev - 1, 1))
                setLoading(true)
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={index >= totalPages}
              onClick={() => {
                setIndex((prev) => prev + 1)
                setLoading(true)
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActiveEmployees
