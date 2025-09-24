// // import React from "react";
// // import { createRoot } from "react-dom/client";
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import Signup from "./pages/Signup";
// // import Login from "./pages/Login";
// // import GenerateReport from "./pages/GenerateReport";
// // import "./index.css";

// // function App() {
// //   const token = localStorage.getItem("ams_token");
// //   return (
// //     <BrowserRouter>
// //       <div className="max-w-2xl mx-auto p-6">
// //         <h1 className="text-2xl font-bold mb-6">
// //           Assessment Management System
// //         </h1>
// //         <Routes>
// //           <Route
// //             path="/"
// //             element={
// //               token ? <Navigate to="/generate" /> : <Navigate to="/login" />
// //             }
// //           />
// //           <Route path="/signup" element={<Signup />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/generate" element={<GenerateReport />} />
// //         </Routes>
// //       </div>
// //     </BrowserRouter>
// //   );
// // }

// // createRoot(document.getElementById("root")).render(<App />);
// import React, { useEffect, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import GenerateReport from "./pages/GenerateReport";
// import "./index.css";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("ams_token"));

//   useEffect(() => {
//     const handleStorage = () => setToken(localStorage.getItem("ams_token"));
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   return (
//     <BrowserRouter>
//       <div className="max-w-2xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-6">
//           Assessment Management System
//         </h1>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               token ? <Navigate to="/generate" /> : <Navigate to="/login" />
//             }
//           />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login onLogin={setToken} />} />
//           <Route
//             path="/generate"
//             element={token ? <GenerateReport /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// createRoot(document.getElementById("root")).render(<App />);
// App.js
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import GenerateReport from "./pages/GenerateReport";
import "./index.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("ams_token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("ams_token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <BrowserRouter>
        <div className="relative max-w-3xl mx-auto p-6">
          {/* Header Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Assessment Management System
              </h1>
            </div>
          </div>

          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={
                token ? <Navigate to="/generate" /> : <Navigate to="/login" />
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={setToken} />} />
            <Route
              path="/generate"
              element={token ? <GenerateReport /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
