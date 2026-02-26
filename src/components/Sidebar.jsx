import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../App";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      {/* Overlay: Jab mobile par sidebar khulay toh peeche wali screen dark ho jaye */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Main Div */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen shadow-xl transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${darkMode 
          ? "bg-slate-800/80 backdrop-blur-xl border-r border-slate-700 text-[#8EC748]" 
          : "bg-white/20 backdrop-blur-xl border-r border-white/30 text-[#0D76BA]"
        }
      `}>
        <div className={`p-6 text-2xl font-bold border-b flex justify-between items-center transition-colors ${
          darkMode 
            ? "border-slate-700 text-[#8EC748]" 
            : "border-white/30 text-[#0D76BA]"
        }`}>
          <span>Menu</span>
          {/* Mobile par Close Button */}
          <button onClick={toggleSidebar} className={`md:hidden text-xl ${
            darkMode ? "text-[#8EC748]" : "text-white"
          }`}>✕</button>
        </div>

        <nav className="p-6 space-y-4 font-medium">
          <Link to="/dashboard" onClick={() => { if(window.innerWidth < 768) toggleSidebar() }} className={`block p-3 rounded-xl transition ${
            darkMode
              ? "hover:bg-slate-700 hover:text-[#8EC748]"
              : "hover:bg-white/30 hover:text-[#8EC748]"
          }`}>
            Dashboard
          </Link>
          <Link to="/mycomplain" onClick={() => { if(window.innerWidth < 768) toggleSidebar() }} className={`block p-3 rounded-xl transition ${
            darkMode
              ? "hover:bg-slate-700 hover:text-[#8EC748]"
              : "hover:bg-white/30 hover:text-[#8EC748]"
          }`}>
            My Complaint
          </Link>
          <Link to="/complain" onClick={() => { if(window.innerWidth < 768) toggleSidebar() }} className={`block p-3 rounded-xl transition ${
            darkMode
              ? "hover:bg-slate-700 hover:text-[#8EC748]"
              : "hover:bg-white/30 hover:text-[#8EC748]"
          }`}>
            New Complaint
          </Link>
          <Link to="/admin" onClick={() => { if(window.innerWidth < 768) toggleSidebar() }} className={`block p-3 rounded-xl transition ${
            darkMode
              ? "hover:bg-slate-700 hover:text-[#8EC748]"
              : "hover:bg-white/30 hover:text-[#8EC748]"
          }`}>
            Admin
          </Link>
        </nav>
      </div>
    </>
  );
}