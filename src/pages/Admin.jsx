import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import { ref, onValue, update, get, remove } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Shield, User, Folder, FileText, Zap, Trash2 } from "lucide-react";
import { ThemeContext } from "../App";

export default function Admin() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const checkRole = async () => {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        navigate("/login");
        return;
      }

      const snapshot = await get(ref(db, "users/" + uid));

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.role !== "admin") {
          navigate("/dashboard");
        }
      }
    };

    checkRole();

    const complaintsRef = ref(db, "complaints");

    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setList(formatted);
      } else {
        setList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = (id, status) => {
    update(ref(db, "complaints/" + id), { status });
    Swal.fire("Updated ✅", "Status Updated", "success");
  };

  const deleteComplaint = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This complaint will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(ref(db, "complaints/" + id));
        Swal.fire("Deleted", "Complaint has been removed.", "success");
      }
    });
  };

  const statusColors = {
    "pending": darkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800",
    "in-progress": darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800",
    "resolved": darkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
  };

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8">
        <Shield className={`w-8 h-8 ${
          darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
        }`} />
        <h2 className={`text-4xl font-bold ${
          darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
        }`}>Admin Panel</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {list.map((c) => (
          <div
            key={c.id}
            className={`rounded-3xl shadow-lg border p-6 hover:shadow-2xl transition-all hover:scale-105 transform animate-slideUp ${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className={`w-5 h-5 ${
                  darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
                }`} />
                <p className={`text-lg font-bold ${
                  darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
                }`}>{c.userName}</p>
              </div>
              <button
                onClick={() => deleteComplaint(c.id)}
                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
                title="Delete complaint"
              >
                <Trash2 className={`w-5 h-5 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`} />
              </button>
            </div>

            <div className={`space-y-3 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {c.createdAt && (
                <p className="text-sm opacity-70">
                  {new Date(c.timestamp).toLocaleString()}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Folder className={`w-5 h-5 ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`} />
                <p><span className="font-semibold">Category:</span> {c.category}</p>
              </div>

              <div className="flex items-start gap-2">
                <FileText className={`w-5 h-5 mt-1 ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`} />
                <p><span className="font-semibold">Issue:</span> {c.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${
                  darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
                }`} />
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[c.status] || (darkMode ? "bg-gray-700" : "bg-gray-100")}`}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1).replace("-", " ")}
                </span>
              </div>
            </div>

            <select
              value={c.status}
              onChange={(e) => updateStatus(c.id, e.target.value)}
              className={`w-full p-2 rounded-lg border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-[#8EC748]"
                  : "bg-white border-gray-300 text-gray-700 focus:border-[#0D76BA]"
              }`}
            >
              <option value="pending">pending</option>
              <option value="in-progress">in-progress</option>
              <option value="resolved">resolved</option>
            </select>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16">
          <p className={`text-lg ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>No complaints to display</p>
        </div>
      )}
    </Layout>
  );
}
