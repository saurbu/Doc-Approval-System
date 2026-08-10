import React from "react";
import {
  UserPlus,
  FileText,
  UsersRound,
  House,
  LogOut,
  ShieldUser,
  Settings,
} from "lucide-react";
import { useNavigate } from 'react-router-dom'


const Sidebar = ({ activePage, setActivePage }) => {
  const menuClass = (page) =>
    `flex items-center gap-2 text-xl p-2 rounded font-semibold transition-all cursor-pointer ${
      activePage === page
        ? "bg-violet-400 text-white"
        : "hover:bg-violet-400 hover:text-white"
    }`;
    const navigate = useNavigate();
    const handleLogout = ()=>{
        localStorage.removeItem('token')
        navigate('/', {replace: true})
    }
    
  return (
    <div className="bg-amber-50 hidden md:block p-5 w-fit space-y-5 rounded-xl h-screen fixed shadow-[0_0_20px_rgba(0,0,0,0.35)]">
      <h1 className="text-2xl max-w-lg p-3 font-bold bg-gradient-to-r from-red-500 to-violet-500 bg-clip-text text-transparent">
        XYZ.com
      </h1>

      <nav className="flex flex-col w-[220px] gap-3">
        <button
          onClick={() => setActivePage("home")}
          className={menuClass("home")}
        >
          <House size={20} />
          Home
        </button>

        <button
          onClick={() => setActivePage("employees")}
          className={menuClass("employees")}
        >
          <UsersRound size={20} />
          Employees
        </button>

        <button
          onClick={() => setActivePage("documents")}
          className={menuClass("documents")}
        >
          <FileText size={20} />
          All Documents
        </button>

        <button
          onClick={() => setActivePage("addEmployee")}
          className={menuClass("addEmployee")}
        >
          <UserPlus size={20} />
          Add Employee
        </button>
        <button
          onClick={() => setActivePage("profile")}
          className={menuClass("profile")}
        >
          <ShieldUser size={20} />
          Profile
        </button>
      </nav>

      <button className="absolute bottom-15 flex items-center gap-2 text-xl text-red-500 cursor-pointer shadow-2xl hover:bg-red-500 hover:text-white w-[220px] p-2 rounded border-2 border-red-500 font-semibold transition"
      onClick={handleLogout}
      >

        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;