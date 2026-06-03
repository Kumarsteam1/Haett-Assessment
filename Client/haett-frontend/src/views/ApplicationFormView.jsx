import { useState } from "react";
import { applyAsPartner } from "../api";

const PARTNER_TYPES = ["Affiliate", "Influencer", "Gym", "Corporate", "Partner Associate"];

export default function ApplicationFormView({ onSuccess, showToast }) {
  const [form, setForm] = useState({
    partnerType: "",
    businessName: "",
    contactPhone: "",
    socialLink: "",
    audienceSize: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const canSubmit = form.partnerType && form.businessName.trim();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        audienceSize: form.audienceSize ? Number(form.audienceSize) : undefined,
      };
      const res = await applyAsPartner(payload);
      if (!res.success) {
        setError(res.message || "Submission failed");
      } else {
        showToast("Application submitted!");
        onSuccess(res.application);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>
        Partner Application
      </h2>
      <p style={{ color: "#666", margin: "0 0 32px", fontSize: "15px" }}>
        Fill in your details below. We'll review and get back to you within a few business days.
      </p>

      <div style={card}>
        <label style={label}>Partner Type *</label>
        <select style={input} value={form.partnerType} onChange={(e) => set("partnerType", e.target.value)}>
          <option value="">Select a type</option>
          {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label style={label}>Business / Brand Name *</label>
        <input style={input} placeholder="Your brand name" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={label}>Contact Phone</label>
            <input style={input} placeholder="+91 00000 00000" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
          </div>
          <div>
            <label style={label}>Audience Size</label>
            <input style={input} type="number" placeholder="e.g. 50000" value={form.audienceSize} onChange={(e) => set("audienceSize", e.target.value)} />
          </div>
        </div>

        <label style={label}>Website / Social Link</label>
        <input style={input} placeholder="https://instagram.com/yourbrand" value={form.socialLink} onChange={(e) => set("socialLink", e.target.value)} />

        <label style={label}>Description</label>
        <textarea
          style={{ ...input, height: "100px", resize: "vertical" }}
          placeholder="Tell us about yourself and your audience (max 500 characters)"
          maxLength={500}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: "#aaa", marginTop: "-8px", marginBottom: "8px" }}>
          {form.description.length}/500
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          style={{
            ...primaryBtn,
            opacity: !canSubmit || loading ? 0.5 : 1,
            cursor: !canSubmit ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1.5px solid #f0f0f0",
  borderRadius: "16px",
  padding: "28px",
};

const label = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#444",
  marginBottom: "6px",
  marginTop: "16px",
};

const input = {
  width: "100%",
  padding: "11px 13px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const primaryBtn = {
  width: "100%",
  marginTop: "8px",
  padding: "13px",
  background: "#e63946",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};