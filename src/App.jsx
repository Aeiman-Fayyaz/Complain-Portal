import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Admin from "./pages/Admin";
import Complain from "./pages/Complain";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Mycomplain from "./pages/Mycomplain";
import SignUp from "./pages/SignUp";
import "./App.css";

export const ThemeContext = createContext();

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true" || false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Main Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complain" element={<Complain />} /> {/* All Complains */}
          <Route path="/mycomplain" element={<Mycomplain />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
