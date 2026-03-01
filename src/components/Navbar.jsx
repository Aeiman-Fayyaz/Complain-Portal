import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../App";
import logo from "../assets/logo.jpg";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire("Logged Out", "You have been logged out", "success");
        navigate("/");
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  return (
    <div className={`h-14 shadow flex justify-between px-4 md:px-6 items-center sticky top-0 z-30 transition-colors duration-300 ${
      darkMode 
        ? "bg-slate-800 text-white" 
        : "bg-white text-slate-900"
    }`}>
      <div className="flex items-center gap-3">
        {/* Hamburger Icon - Sirf Mobile par dikhega (md:hidden) */}
        <button 
          onClick={toggleSidebar} 
          className={`md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-2xl focus:outline-none transition-colors ${
            darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
          }`}
        >
          ☰
        </button>
        <img src={logo} alt="Logo" className="w-18 h-12 rounded-lg" />
        <h1 className={`font-bold text-lg md:text-xl ${
          darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
        }`}>
          Complaint Portal
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark/Light Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors font-medium text-sm ${
            darkMode 
              ? "bg-slate-700 text-yellow-300 hover:bg-slate-600" 
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}