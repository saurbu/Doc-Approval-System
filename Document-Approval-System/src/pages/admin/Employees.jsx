import React, { useState } from 'react'
import { Search, Users, UserCheck, UserX } from 'lucide-react'
import AllEmployees from './AllEmployees'
import ActiveEmployees from './ActiveEmployees'
import InActiveEmployees from './InActiveEmployees'

const Employees = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState('');

  const tabs = [
    { id: "all", label: "All Employees", icon: Users, count: null },
    { id: "active", label: "Active", icon: UserCheck, count: null },
    { id: "inactive", label: "Inactive", icon: UserX, count: null },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage and inspect all registered staff accounts.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ID, or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-xl transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-xs">
        {activeTab === "all" && <AllEmployees search={search} />}
        {activeTab === "active" && <ActiveEmployees search={search} />}
        {activeTab === "inactive" && <InActiveEmployees search={search} />}
      </div>
    </div>
  );
};

export default Employees;
