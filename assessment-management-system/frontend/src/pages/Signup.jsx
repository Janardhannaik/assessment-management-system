import React, { useState } from "react";
import { signup, login } from "../api"; // login API imported
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handle(e) {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1️⃣ Signup API call
      await signup({ name, email: normalizedEmail, password });

      setMsg("Signup successful! Logging in...");

      // 2️⃣ Immediately try login in background
      let loginSuccess = false;
      let attempts = 0;

      while (!loginSuccess && attempts < 5) {
        attempts++;
        try {
          await login({ email: normalizedEmail, password });
          loginSuccess = true;
        } catch (err) {
          // wait 1 second before retry if login fails
          await new Promise((res) => setTimeout(res, 1000));
        }
      }

      if (loginSuccess) {
        setMsg("Login successful! Redirecting...");
        setTimeout(() => navigate("/login"), 500);
      } else {
        setMsg("Login not ready yet. Please try again.");
      }
    } catch (err) {
      setMsg(err?.response?.data?.error || "Error during signup");
    } finally {
      setIsLoading(false);
    }
  }

  const getMessageColor = () => {
    if (!msg) return "";
    if (msg.toLowerCase().includes("error")) return "text-red-400";
    if (msg.toLowerCase().includes("successful")) return "text-green-400";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent text-center">
          Sign Up
        </h2>

        {msg && (
          <div
            className={`mb-4 p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 ${getMessageColor()}`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
            disabled={isLoading}
          />
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
            {isLoading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-purple-200">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
