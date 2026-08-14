import { useEffect, useState } from 'react'
import axios from 'axios';
import { EllipsisVertical, Phone, Building2, Mail, ChevronLeft, ChevronRight, User } from 'lucide-react'

const AllEmployees = ({ search }) => {
  const [empCard, setEmpCard] = useState([]);
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1);

  const filterEmployee = empCard.filter((emp) =>
    (emp.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (emp.empId || '').toLowerCase().includes(search.toLowerCase()) ||
    (emp.role || '').toLowerCase().includes(search.toLowerCase())
  )

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
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Fetching employee directory...</p>
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
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {emp.empId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      emp.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Name and Role */}
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

                {/* Contact & Detail Items */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{emp.number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{emp.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{emp.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-slate-700">No employees match your search</h4>
            <p className="text-xs text-slate-400 mt-1">Try refining your search query or clear the filter.</p>
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
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

export default AllEmployees
