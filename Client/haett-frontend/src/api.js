const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Auth ──────────────────────────────────────────────
export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const register = (name, email, password) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  }).then((r) => r.json());

export const getMe = () =>
  fetch(`${BASE}/auth/me`, { headers: headers() }).then((r) => r.json());

// ── Partner ───────────────────────────────────────────
export const getMyApplication = () =>
  fetch(`${BASE}/partner/my-application`, { headers: headers() }).then((r) =>
    r.json()
  );

export const applyAsPartner = (data) =>
  fetch(`${BASE}/partner/apply`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMyCodes = () =>
  fetch(`${BASE}/partner/my-codes`, { headers: headers() }).then((r) =>
    r.json()
  );

// ── Admin ─────────────────────────────────────────────
export const getApplications = (status = "all") =>
  fetch(`${BASE}/admin/applications?status=${status}`, {
    headers: headers(),
  }).then((r) => r.json());

export const approveApplication = (id) =>
  fetch(`${BASE}/admin/applications/${id}/approve`, {
    method: "POST",
    headers: headers(),
  }).then((r) => r.json());

export const rejectApplication = (id, reason) =>
  fetch(`${BASE}/admin/applications/${id}/reject`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ reason }),
  }).then((r) => r.json());

export const getPartnerCodes = (id) =>
  fetch(`${BASE}/admin/applications/${id}/codes`, {
    headers: headers(),
  }).then((r) => r.json());

export const toggleCode = (codeId) =>
  fetch(`${BASE}/admin/codes/${codeId}/toggle`, {
    method: "PATCH",
    headers: headers(),
  }).then((r) => r.json());