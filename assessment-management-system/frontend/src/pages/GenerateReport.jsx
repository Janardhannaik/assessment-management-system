// import React, { useState } from "react";
// import { generateReport, getSession } from "../api";

// export default function GenerateReport() {
//   const [sessionId, setSessionId] = useState("");
//   const [msg, setMsg] = useState(null);
//   const [reportUrl, setReportUrl] = useState(null);
//   const [sessionData, setSessionData] = useState(null);

//   async function handleGenerate(e) {
//     e.preventDefault();
//     if (!sessionId) return setMsg("Please enter a session ID");
//     setMsg("Generating...");
//     try {
//       const r = await generateReport(sessionId);
//       const url = `http://localhost:5000${r.data.url}`;
//       setReportUrl(url);
//       setMsg("Report generated successfully!");
//     } catch (err) {
//       setMsg(err?.response?.data?.error || "Error generating report");
//     }
//   }

//   async function fetchSession() {
//     if (!sessionId) return setMsg("Please enter a session ID");
//     try {
//       const r = await getSession(sessionId);
//       setSessionData(r.data);
//       setMsg(null);
//     } catch (err) {
//       setSessionData(null);
//       setMsg(err?.response?.data?.error || "Not found or unauthorized");
//     }
//   }

//   function logout() {
//     localStorage.removeItem("ams_token");
//     window.location.href = "/login";
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <div className="font-medium text-lg">Generate Report</div>
//         <button onClick={logout} className="text-sm text-red-600">
//           Logout
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded shadow mb-4">
//         <form onSubmit={handleGenerate} className="space-y-3">
//           <input
//             value={sessionId}
//             onChange={(e) => setSessionId(e.target.value)}
//             placeholder="Enter session_id (e.g., session_001)"
//             className="w-full border p-2 rounded"
//           />
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Generate PDF
//             </button>
//             <button
//               type="button"
//               onClick={fetchSession}
//               className="bg-gray-200 px-4 py-2 rounded"
//             >
//               Preview Session JSON
//             </button>
//           </div>
//         </form>
//         {msg && <div className="mt-3 text-sm text-blue-600">{msg}</div>}
//       </div>

//       {sessionData && (
//         <div className="bg-white p-4 rounded mb-4">
//           <h3 className="font-semibold mb-2">Session JSON Preview</h3>
//           <pre className="text-xs max-h-60 overflow-auto">
//             {JSON.stringify(sessionData, null, 2)}
//           </pre>
//         </div>
//       )}

//       {reportUrl && (
//         <div className="bg-white p-4 rounded">
//           <h3 className="font-semibold mb-2">Downloaded Report</h3>
//           <a
//             href={reportUrl}
//             target="_blank"
//             rel="noreferrer"
//             className="text-blue-600"
//           >
//             Open PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { generateReport, getSession } from "../api";

export default function GenerateReport() {
  const [sessionId, setSessionId] = useState("");
  const [msg, setMsg] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!sessionId) return setMsg("Please enter a session ID");
    setIsLoading(true);
    setMsg("Generating...");
    try {
      const r = await generateReport(sessionId);
      const url = `http://localhost:5000${r.data.url}`;
      setReportUrl(url);
      setMsg("Report generated successfully!");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Error generating report");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSession() {
    if (!sessionId) return setMsg("Please enter a session ID");
    setIsLoading(true);
    try {
      const r = await getSession(sessionId);
      setSessionData(r.data);
      setMsg(null);
    } catch (err) {
      setSessionData(null);
      setMsg(err?.response?.data?.error || "Not found or unauthorized");
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("ams_token");
    window.location.href = "/login";
  }

  const getMessageColor = () => {
    if (!msg) return "";
    if (msg.includes("Error") || msg.includes("Not found"))
      return "text-red-400";
    if (msg.includes("successfully")) return "text-green-400";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Floating Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Generate Report
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200">
                Session ID
              </label>
              <input
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session_id (e.g., session_001)"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate PDF"}
              </button>
              <button
                type="button"
                onClick={fetchSession}
                disabled={isLoading}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview Session
              </button>
            </div>
          </form>

          {msg && (
            <div
              className={`mt-6 p-4 rounded-xl bg-white/5 border border-white/10 ${getMessageColor()} animate-fadeIn`}
            >
              {msg}
            </div>
          )}
        </div>

        {/* Session Data Preview */}
        {sessionData && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] animate-slideIn">
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              Session JSON Preview
            </h3>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <pre className="text-xs text-green-300 max-h-60 overflow-auto">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Report URL */}
        {reportUrl && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] animate-slideIn">
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              Downloaded Report
            </h3>
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Open PDF Report
            </a>
          </div>
        )}
      </div>

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
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
