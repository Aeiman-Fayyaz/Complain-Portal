import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import { ref, push, get } from "firebase/database";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AlertCircle, MessageSquare } from "lucide-react";
import { ThemeContext } from "../App";

export default function Trainer() {

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

        if (userData.role !== "trainer") {
          navigate("/dashboard");
        }
      }
    };

    checkRole();

  }, []);

  const submit = (e) => {
    e.preventDefault();

    const category = e.target.category.value;
    const description = e.target.desc.value;
    const currentDate = new Date();

    const uid = auth.currentUser.uid;
    get(ref(db, "users/" + uid)).then((snap) => {
      const userData = snap.exists() ? snap.val() : {};

      push(ref(db, "complaints"), {
        userId: uid,
        userName: userData.name || auth.currentUser.email,
        userRole: userData.role || "trainer",
        category,
        description,
        status: "pending",
        createdAt: currentDate.toISOString(),
        timestamp: currentDate.getTime()
      });

      Swal.fire("Submitted 🎉", "Complaint Added Successfully", "success");

      e.target.reset();
    });
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh] py-8">
        <div className="w-full max-w-md animate-slideUp">
          <div className={`rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
            darkMode 
              ? "bg-slate-800 border-slate-700" 
              : "bg-white border-gray-100"
          }`}>
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className={`w-8 h-8 mr-3 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <h2 className={`text-3xl font-bold ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`}>
                Trainer Complaint
              </h2>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="relative">
                <select
                  name="category"
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 appearance-none ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-[#8EC748]"
                      : "bg-white border-gray-300 text-gray-700 focus:border-[#0D76BA]"
                  }`}
                  required
                >
                  <option value="">Select Issue Category</option>
                  <option value="Policy">Policy</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative">
                <MessageSquare className={`absolute left-3 top-3 w-5 h-5 ${
                  darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
                }`} />
                <textarea
                  name="desc"
                  placeholder="Describe your issue in detail..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none resize-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                      : "bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:border-[#0D76BA]"
                  }`}
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-[#0D76BA] to-[#8EC748] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all transform active:scale-95"
              >
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
