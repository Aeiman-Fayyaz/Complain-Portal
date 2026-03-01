import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../App";
import logo from "../assets/logo.jpg";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = "admin.smit@gmail.com";

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const email = user.email;

      const snapshot = await get(ref(db, "users/" + user.uid));

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.role === "admin" && email !== ADMIN_EMAIL) {
          Swal.fire("Error ❌", "Only admin.smit@gmail.com can access admin portal", "error");
          await auth.signOut();
          return;
        }

        Swal.fire("Success 🎉", "Login Successful", "success");

        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const role = email === ADMIN_EMAIL ? "admin" : "student";
        await set(ref(db, "users/" + user.uid), {
          name: user.displayName || email.split("@")[0],
          email: email,
          role: role,
        });

        Swal.fire("Success 🎉", "Login Successful", "success");
        navigate(role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (error) {
      Swal.fire("Error ❌", error.message, "error");
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire("Success 🎉", "Password reset email sent to " + email, "success");
      } catch (error) {
        Swal.fire("Error ❌", error.message, "error");
      }
    }
  };

  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const selectedRole = e.target.role?.value || "";

    try {
      if (email !== ADMIN_EMAIL) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const snapshot = await get(ref(db, "users/" + uid));

        if (snapshot.exists()) {
          const userData = snapshot.val();

          if (userData.role === "admin") {
            Swal.fire("Error ❌", "Only admin.smit@gmail.com can access admin portal", "error");
            await auth.signOut();
            return;
          }

          if (selectedRole && selectedRole !== userData.role) {
            Swal.fire("Error ❌", "Selected role does not match registered role", "error");
            await auth.signOut();
            return;
          }

          Swal.fire("Success 🎉", "Login Successful", "success");
          if (userData.role === "trainer") navigate("/trainer");
          else navigate("/dashboard");
        } else {
          await set(ref(db, "users/" + uid), {
            name: email.split("@")[0],
            email: email,
            role: "student",
            batch: "",
            course: "",
            campus: "",
          });

          Swal.fire("Success 🎉", "Login Successful", "success");
          navigate("/dashboard");
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const snapshot = await get(ref(db, "users/" + uid));

        if (snapshot.exists()) {
          const userData = snapshot.val();

          if (userData.role !== "admin") {
            Swal.fire("Error ❌", "This email is not registered as admin", "error");
            await auth.signOut();
            return;
          }

          Swal.fire("Success 🎉", "Admin Login Successful", "success");
          navigate("/admin");
        } else {
          await set(ref(db, "users/" + uid), {
            name: email.split("@")[0],
            email: email,
            role: "admin",
          });

          Swal.fire("Success 🎉", "Admin Login Successful", "success");
          navigate("/admin");
        }
      }
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
            Sign in to continue
          </p>

          <form onSubmit={login} className="space-y-6">
            <div className="relative group">
              <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${
                darkMode ? "text-[#8EC748]" : "text-[#0D76BA]"
              }`} />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-[#8EC748]"
                    : "bg-white border-gray-300 text-slate-900 placeholder-gray-500 focus:border-[#0D76BA]"
                }`}
                required
              />
            </div>

            <select
              name="role"
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#0D76BA]/30 ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-[#8EC748]"
                  : "bg-white border-gray-300 text-gray-700 focus:border-[#0D76BA]"
              }`}
            >
              <option value="">Select Role (optional)</option>
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>

            <div className="relative group">
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

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#0D76BA] to-[#8EC748] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all transform active:scale-95"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className={`w-full mt-5 py-3 rounded-xl font-semibold border transition-colors flex items-center justify-center gap-2 hover:shadow-lg ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full mt-4 text-sm text-[#0D76BA] hover:text-[#0D76BA]/80 font-medium transition"
          >
            Forgot Password?
          </button>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#0D76BA] hover:text-[#0D76BA]/80 transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
