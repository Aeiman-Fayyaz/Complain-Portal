import { useState, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ThemeContext } from "../App";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  // Sidebar toggle karne ka function
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? "bg-slate-900" : "bg-white"
    }`}>
      {/* Navbar ko function pass kar dia */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar ko state aur function pass kar dia */}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content Area: Mobile par p-4, Desktop par p-8 */}
        <main className={`flex-1 p-4 md:p-8 overflow-y-auto w-full transition-all duration-300 ${
          darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}