import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import { ref, onValue, get, update } from "firebase/database";
import Swal from "sweetalert2";
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
              <p className="mt-2">Batch: {c.batch || '—'} • Course: {c.course || '—'} • Campus: {c.campus || '—'}</p>
              <p className="mt-3">Status: {c.status}</p>

              <div className="mt-4 flex gap-3">
                <button onClick={async () => {
                  const { value: newDesc } = await Swal.fire({
                    title: 'Edit Description',
                    input: 'textarea',
                    inputLabel: 'Description',
                    inputValue: c.description || '',
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    cancelButtonText: 'Cancel',
                    inputAttributes: {
                      'aria-label': 'Type the updated description here'
                    },
                    preConfirm: (value) => {
                      if (!value || !value.trim()) {
                        Swal.showValidationMessage('Description cannot be empty');
                      }
                      return value;
                    }
                  });

                  if (newDesc !== undefined && newDesc !== null) {
                    await update(ref(db, 'complaints/' + c.id), {
                      description: newDesc
                    });
                    Swal.fire('Updated ✅', 'Complaint description updated', 'success');
                  }
                }} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Edit</button>
              </div>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  );
}