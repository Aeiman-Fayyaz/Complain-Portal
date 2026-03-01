import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../App";
import logo from "../assets/logo.jpg";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ADMIN_EMAIL = "admin.smit@gmail.com";

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const email = user.email;

      const role = email === ADMIN_EMAIL ? "admin" : "student";
      await set(ref(db, "users/" + user.uid), {
        name: user.displayName || email.split("@")[0],
        email: email,
        role: role,
        batch: "",
        course: "",
        campus: "",
      });

      Swal.fire("Success 🎉", "Account Created", "success");
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      Swal.fire("Error ❌", error.message, "error");
    }
  };

  const register = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const role = e.target.role.value;
    const batch = e.target.batch?.value || "";
    const course = e.target.course?.value || "";
    const campus = e.target.campus?.value || "";

    if (password !== confirmPassword) {
      Swal.fire("Error ❌", "Password and Confirm Password do not match", "error");
      return;
    }

    if (role === "admin" && email !== ADMIN_EMAIL) {
      Swal.fire("Error ❌", "Only admin.smit@gmail.com can register as admin", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
        role: role,
        batch: batch,
        course: course,
        campus: campus,
      });

      Swal.fire("Success 🎉", "Account Created", "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error ❌", error.message, "error");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300 ${
      darkMode ? "bg-slate-900" : "bg-white"
    }`}>
      <div className="w-full max-w-md animate-slideUp">
        <div className={`rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
          darkMode 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-gray-100"
        }`}>
          <img src={logo} alt="Logo" className="mx-auto w-24 h-24 mb-6 rounded-full shadow-lg hover:scale-105 transition-transform" />
          
          <h1 className={`text-3xl font-bold text-center mb-2 ${
            darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
          }`}>
            Complaint Portal
          </h1>

          <p className={`text-center mb-8 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Create your account
          </p>

          <form onSubmit={register} className="space-y-5">
            <div className="relative">
              <User className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <input
                name="name"
                placeholder="Enter Name"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                    : "bg-white border-gray-300 text-slate-900 placeholder-gray-500 focus:border-[#0D76BA]"
                }`}
                required
              />
            </div>

            <div className="relative">
              <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <input
                name="email"
                type="email"
                placeholder="Enter Email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                    : "bg-white border-gray-300 text-slate-900 placeholder-gray-500 focus:border-[#0D76BA]"
                }`}
                required
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                    : "bg-white border-gray-300 text-slate-900 placeholder-gray-500 focus:border-[#0D76BA]"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3.5 transition ${
                  darkMode 
                    ? "text-gray-400 hover:text-[#8EC748]" 
                    : "text-gray-500 hover:text-[#0D76BA]"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                    : "bg-white border-gray-300 text-slate-900 placeholder-gray-500 focus:border-[#0D76BA]"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-3.5 transition ${
                  darkMode 
                    ? "text-gray-400 hover:text-[#8EC748]" 
                    : "text-gray-500 hover:text-[#0D76BA]"
                }`}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <select
              name="role"
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-[#8EC748]"
                  : "bg-white border-gray-300 text-gray-700 focus:border-[#0D76BA]"
              }`}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>

            {/* Student specific fields */}
            <div className="space-y-3">
              <input name="batch" placeholder="Batch (e.g. 2023)" className="w-full px-4 py-3 rounded-xl border" />
              <input name="course" placeholder="Course (e.g. BCS)" className="w-full px-4 py-3 rounded-xl border" />
              <input name="campus" placeholder="Campus (e.g. Main Campus)" className="w-full px-4 py-3 rounded-xl border" />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#0D76BA] to-[#8EC748] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all transform active:scale-95"
            >
              Register
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            className="w-full mt-5 py-3 rounded-xl font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 hover:shadow-lg"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-[#0D76BA] hover:text-[#0D76BA]/80 transition">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
