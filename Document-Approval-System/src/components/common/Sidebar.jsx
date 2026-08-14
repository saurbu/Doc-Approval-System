import React, { useState } from "react";
import {
  UserPlus,
  FileText,
  UsersRound,
  House,
  LogOut,
  ShieldUser,
  Menu,
  X,
  Building2,
  CheckCircle2,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuClass = (page) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full ${
      activePage === page
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">DocApproval</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="hidden md:flex items-center gap-3 px-2 mb-8">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">DocApproval</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 mt-14 md:mt-0">
            <button onClick={() => handleNavClick("home")} className={menuClass("home")}>
              <House size={18} />
              <span>Dashboard</span>
            </button>

            <button onClick={() => handleNavClick("employees")} className={menuClass("employees")}>
              <UsersRound size={18} />
              <span>Employees</span>
            </button>

            <button onClick={() => handleNavClick("documents")} className={menuClass("documents")}>
              <FileText size={18} />
              <span>All Documents</span>
            </button>

            <button onClick={() => handleNavClick("addEmployee")} className={menuClass("addEmployee")}>
              <UserPlus size={18} />
              <span>Add Employee</span>
            </button>

            <button onClick={() => handleNavClick("profile")} className={menuClass("profile")}>
              <ShieldUser size={18} />
              <span>Admin Profile</span>
            </button>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;