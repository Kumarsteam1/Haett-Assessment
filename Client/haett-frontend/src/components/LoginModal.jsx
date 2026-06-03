import React, { useState } from "react";
import { login, register } from "../api";

export default function LoginModal({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password);

      if (!res.success) {
        setError(res.message || "Something went wrong");
      } else {
        localStorage.setItem("token", res.token);
        onSuccess(res.user);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        <h2 style={{ margin: "0 0 6px", fontSize: "22px", color: "#1a1a2e" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ margin: "0 0 24px", color: "#666", fontSize: "14px" }}>
          {mode === "login" ? "Sign in to continue" : "Join the Haett partner programme"}
        </p>

        {mode === "register" && (
          <input
            style={input}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        )}
        <input
          style={input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <input
          style={input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: "0 0 12px" }}>{error}</p>}

        <button
          style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", fontWeight: 600, padding: 0 }}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  borderRadius: "16px",
  padding: "36px",
  width: "100%",
  maxWidth: "420px",
  position: "relative",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const closeBtn = {
  position: "absolute", top: "16px", right: "16px",
  background: "none", border: "none",
  fontSize: "18px", cursor: "pointer", color: "#999",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  marginBottom: "12px",
  boxSizing: "border-box",
  outline: "none",
};

const primaryBtn = {
  width: "100%",
  padding: "13px",
  background: "#e63946",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};