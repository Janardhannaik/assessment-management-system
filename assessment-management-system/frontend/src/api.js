import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function signup(payload) {
  return axios.post(`${BASE}/auth/signup`, payload);
}

export function login(payload) {
  return axios.post(`${BASE}/auth/login`, payload);
}

export function generateReport(session_id) {
  const token = localStorage.getItem("ams_token");
  return axios.post(
    `${BASE}/generate-report`,
    { session_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function getSession(session_id) {
  const token = localStorage.getItem("ams_token");
  return axios.get(`${BASE}/session/${session_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
