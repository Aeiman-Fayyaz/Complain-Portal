import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import { ref, onValue, get } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

export default function MyComplain() {

  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {

    const checkRoleAndFetch = async () => {

      const uid = auth.currentUser?.uid;

      if (!uid) {
        navigate("/login");
        return;
      }

      const snapshot = await get(ref(db, "users/" + uid));

      if (snapshot.exists()) {

        const userData = snapshot.val();

        if (userData.role !== "student") {
          navigate("/admin"); // ❌ admin ko yahan se hata do
          return;
        }

        const complaintsRef = ref(db, "complaints");

        onValue(complaintsRef, (snap) => {

          if (snap.exists()) {

            const data = snap.val();

            const myData = Object.keys(data)
              .map(key => ({ id: key, ...data[key] }))
              .filter(item => item.userId === uid);

            setList(myData);

          } else {
            setList([]);
          }

        });

      }
    };

    checkRoleAndFetch();

  }, []);

  return (
    <Layout>

      <div className="min-h-screen p-6">

        <h2 className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
        }`}>
          My Complaints
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {list.map((c) => (

            <div key={c.id}
              className={`backdrop-blur-xl p-6 rounded-3xl shadow-xl transition-colors ${
                darkMode
                  ? "bg-slate-800/60 border border-slate-700 text-[#8EC748]"
                  : "bg-white/20 border border-white/30 text-[#8EC748]"
              }`}>

              {c.timestamp && (
                <p className="text-sm opacity-70">
                  {new Date(c.timestamp).toLocaleString()}
                </p>
              )}

              <p className={`font-bold text-lg ${
                darkMode ? "text-[#8EC748]" : "text-[#8EC748]"
              }`}>{c.category}</p>
              <p className="mt-2">{c.description}</p>
              <p className="mt-3">Status: {c.status}</p>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  );
}