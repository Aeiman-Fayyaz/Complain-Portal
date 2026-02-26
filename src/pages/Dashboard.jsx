import Layout from "../components/Layout";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { BarChart3, Clock, Wrench, CheckCircle } from "lucide-react";
import { ThemeContext } from "../App";

export default function Dashboard() {
  const { darkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);

  useEffect(() => {

    const complaintsRef = ref(db, "complaints");

    onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const formatted = Object.values(snapshot.val());
        setData(formatted);
      } else {
        setData([]);
      }
    });

  }, []);

  const total = data.length;
  const pending = data.filter(c => c.status === "pending").length;
  const inProgress = data.filter(c => c.status === "in-progress").length;
  const resolved = data.filter(c => c.status === "resolved").length;

  return (
    <Layout>

      <h2 className={`text-4xl font-bold mb-8 ${
        darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
      }`}>
        Dashboard
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        {/* Total */}
        <div className={`bg-linear-to-r from-[#0D76BA] to-[#8EC748] p-8 rounded-3xl text-white shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer group ${
          darkMode ? "dark:shadow-lg dark:shadow-[#0D76BA]/30" : ""
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Complaints</h3>
            <BarChart3 className="w-8 h-8 group-hover:rotate-12 transition" />
          </div>
          <p className="text-5xl font-bold">{total}</p>
          <p className="text-xs mt-2 opacity-90">All submitted complaints</p>
        </div>

        {/* Pending */}
        <div className={`p-8 rounded-3xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer group ${
          darkMode 
            ? "bg-slate-700 text-[#8EC748]" 
            : "bg-[#EAF2F7] text-[#0D76BA]"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending</h3>
            <Clock className="w-8 h-8 group-hover:animate-spin transition" />
          </div>
          <p className="text-5xl font-bold">{pending}</p>
          <p className={`text-xs mt-2 ${darkMode ? "opacity-70" : "opacity-75"}`}>Awaiting review</p>
        </div>

        {/* In Progress */}
        <div className={`bg-linear-to-r from-[#8EC748] to-[#0D76BA] p-8 rounded-3xl text-white shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer group ${
          darkMode ? "dark:shadow-lg dark:shadow-[#8EC748]/30" : ""
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">In Progress</h3>
            <Wrench className="w-8 h-8 group-hover:rotate-12 transition" />
          </div>
          <p className="text-5xl font-bold">{inProgress}</p>
          <p className="text-xs mt-2 opacity-90">Being worked on</p>
        </div>

        {/* Resolved */}
        <div className={`p-8 rounded-3xl text-white shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer group ${
          darkMode 
            ? "bg-slate-700" 
            : "bg-[#8EC748]"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Resolved</h3>
            <CheckCircle className="w-8 h-8 group-hover:scale-110 transition" />
          </div>
          <p className="text-5xl font-bold">{resolved}</p>
          <p className="text-xs mt-2 opacity-90">Completed</p>
        </div>

      </div>

    </Layout>
  );
}
