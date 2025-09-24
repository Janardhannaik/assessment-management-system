import React, { useState, useEffect } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Prefill from localStorage if available
    const newUser = JSON.parse(localStorage.getItem("ams_new_user"));
    if (newUser) {
      setEmail(newUser.email);
      setPassword(""); // user still needs to type password
      localStorage.removeItem("ams_new_user"); // cleanup
    }
  }, []);

  async function handle(e) {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);

    try {
      const r = await login({ email, password });
      const token = r.data.token;
      localStorage.setItem("ams_token", token);
      if (onLogin) onLogin(token);
      navigate("/generate");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  const getMessageColor = () => {
    if (!msg) return "";
    if (msg.includes("Invalid")) return "text-red-400";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent text-center">
          Login
        </h2>

        {msg && (
          <div
            className={`mb-4 p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 ${getMessageColor()} animate-fadeIn`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
            disabled={isLoading}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-purple-200">
          New?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { login as apiLogin } from "../api";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Auto-fill from localStorage cached user
//     const cached = JSON.parse(localStorage.getItem("ams_cached_user"));
//     if (cached) {
//       setEmail(cached.email);
//       setPassword(cached.password);
//     }
//   }, []);

//   async function handle(e) {
//     e.preventDefault();
//     setMsg(null);
//     setIsLoading(true);

//     try {
//       const normalizedEmail = email.trim().toLowerCase();
//       const cachedUser = JSON.parse(localStorage.getItem("ams_cached_user"));

//       // Use cached info if it matches
//       if (
//         cachedUser &&
//         cachedUser.email === normalizedEmail &&
//         cachedUser.password === password
//       ) {
//         // Generate temporary token for instant login
//         const token = "local-cache-token";
//         localStorage.setItem("ams_token", token);
//         if (onLogin) onLogin(token);
//         navigate("/generate");
//         return;
//       }

//       // Otherwise, call backend login
//       const r = await apiLogin({ email: normalizedEmail, password });
//       const token = r.data.token;
//       localStorage.setItem("ams_token", token);

//       // Update cached user
//       localStorage.setItem(
//         "ams_cached_user",
//         JSON.stringify({ email: normalizedEmail, password })
//       );

//       if (onLogin) onLogin(token);
//       navigate("/generate");
//     } catch (err) {
//       setMsg(err?.response?.data?.error || "Invalid credentials");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const getMessageColor = () => {
//     if (!msg) return "";
//     if (msg.includes("Invalid")) return "text-red-400";
//     return "text-blue-400";
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
//         <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent text-center">
//           Login
//         </h2>

//         {msg && (
//           <div
//             className={`mb-4 p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 ${getMessageColor()}`}
//           >
//             {msg}
//           </div>
//         )}

//         <form onSubmit={handle} className="space-y-4">
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
//             disabled={isLoading}
//           />
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             type="password"
//             className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
//             disabled={isLoading}
//           />

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="mt-4 text-sm text-center text-purple-200">
//           New?{" "}
//           <Link
//             to="/signup"
//             className="text-blue-400 hover:text-blue-300 transition-colors"
//           >
//             Create account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
