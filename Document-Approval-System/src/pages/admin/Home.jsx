import React, { useEffect, useState } from 'react'
import { 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2,
  Sparkles
} from 'lucide-react'
import axios from 'axios'

const Home = ({ setActivePage }) => {
  const [allEmp, setAllEmp] = useState(0);
  const [isActive, setIsActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const countEmp = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          "http://localhost:3000/api/admin/employee-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setAllEmp(response.data.totalEmployees || 0)
        setIsActive(response.data.activeEmployees || 0)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
    countEmp()
  }, [])

  const stats = [
    {
      title: "Total Employees",
      value: allEmp,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      badge: "+12% this month",
      trend: "up"
    },
    {
      title: "Active Staff",
      value: isActive,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      badge: "Active",
      trend: "up"
    },
    {
      title: "Total Documents",
      value: 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      badge: "System Wide",
      trend: "neutral"
    },
    {
      title: "Pending Approvals",
      value: 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      badge: "Requires Action",
      trend: "warning"
    },
    {
      title: "Approved Documents",
      value: 0,
      icon: CheckCircle2,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
      badge: "Processed",
      trend: "up"
    }
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, Administrator</h1>
            <p className="text-indigo-100 text-sm sm:text-base mt-1 max-w-xl">
              Here is an overview of your organization's employee activity, pending approvals, and document metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActivePage && setActivePage("addEmployee")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm shadow-md hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-500/30 backdrop-blur-md border border-white/20 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>System Highlights & Metrics</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {stat.badge}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Quick Employee Operations</span>
            </h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Manage existing team members, approve pending onboardings, or add new staff members to the directory.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActivePage && setActivePage("employees")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <span>View All Employees</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActivePage && setActivePage("addEmployee")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <span>Register New Employee</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Document System Status</span>
            </h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Document approval workflow system is active and monitoring requests. Zero backlog reported currently.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>API Gateway Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Database Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
 