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


const Navbar = ({ activePage, setActivePage }) => {
  const menuClass = (page) =>
    `flex items-center gap-2 text-xl p-2 rounded font-semibold transition-all cursor-pointer ${
      activePage === page
        ? "bg-violet-400 text-white"
        : "hover:bg-violet-400 hover:text-white"
    }`;
    const navigate = useNavigate();
    
  return (
    <div className="h-15 md:hidden w-full fixed bottom-0 bg-amber-100 px-3">
      <nav className="flex w-full items-center justify-between gap-3 p-3 ">
        <button
          onClick={() => setActivePage("home")}
          className={menuClass("home")}
        >
          <House size={20} />
        </button>

        <button
          onClick={() => setActivePage("employees")}
          className={menuClass("employees")}
        >
          <UsersRound size={20} />
        </button>

        <button
          onClick={() => setActivePage("addEmployee")}
          className={menuClass("addEmployee")}
        >
          <UserPlus size={20} />
        </button>
        <button
          onClick={() => setActivePage("documents")}
          className={menuClass("documents")}
        >
          <FileText size={20} />
        </button>

        <button
          onClick={() => setActivePage("profile")}
          className={menuClass("profile")}
        >
          <ShieldUser size={20} />
        </button>
      </nav>

      {/* <button className="absolute bottom-15 flex items-center gap-2 text-xl text-red-500 cursor-pointer shadow-2xl hover:bg-red-500 hover:text-white w-[220px] p-2 rounded border-2 border-red-500 font-semibold transition"
      onClick={handleLogout}
      >

        <LogOut size={18} />
        Logout
      </button> */}
    </div>
  );
};

export default Navbar;