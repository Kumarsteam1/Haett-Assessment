import { useState, useEffect } from "react";
import { getMyCodes } from "../api";

export default function DashboardView({ application, showToast }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCodes().then((res) => {
      if (res.success) setCodes(res.codes);
      setLoading(false);
    });
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast("Code copied to clipboard!", "success");
  };

  const approvedDate = new Date(application?.approvedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const totalUsed = codes.reduce((s, c) => s + c.usedCount, 0);
  const totalDiscount = codes.reduce((s, c) => s + c.totalDiscountGiven, 0);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "inline-block",
          background: "#f0fdf4",
          color: "#16a34a",
          padding: "5px 14px",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "12px",
          letterSpacing: "0.5px",
        }}>
          ✓ APPROVED PARTNER
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" }}>
          Partner Dashboard
        </h2>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
          {application?.partnerType} · Approved on {approvedDate}
        </p>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "32px" }}>
        {[
          { label: "Total Codes", value: codes.length },
          { label: "Total Uses", value: totalUsed },
          { label: "Discount Given", value: `₹${totalDiscount.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff",
            border: "1.5px solid #f0f0f0",
            borderRadius: "12px",
            padding: "18px 20px",
          }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a2e" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Codes list */}
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" }}>
        Your Discount Codes
      </h3>

      {loading ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: "40px" }}>Loading codes...</p>
      ) : codes.length === 0 ? (
        <div style={{
          background: "#fafafa",
          border: "1.5px dashed #e5e7eb",
          borderRadius: "12px",
          padding: "48px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🎫</p>
          <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
            No discount codes assigned yet. Check back soon.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {codes.map((c) => (
            <div key={c._id} style={{
              background: "#fff",
              border: "1.5px solid #f0f0f0",
              borderRadius: "12px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  background: "#f9f9f9",
                  border: "1.5px dashed #d1d5db",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "1px",
                  color: "#1a1a2e",
                }}>
                  {c.code}
                </div>
                <button
                  onClick={() => copyCode(c.code)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                  title="Copy code"
                >
                  📋
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#e63946" }}>
                  {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                </span>
                <span style={{ fontSize: "13px", color: "#888" }}>
                  Used {c.usedCount}×
                </span>
                {c.expiryDate && (
                  <span style={{ fontSize: "12px", color: "#aaa" }}>
                    Expires {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                  </span>
                )}
                <span style={{
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontWeight: 700,
                  background: c.isActive ? "#f0fdf4" : "#fafafa",
                  color: c.isActive ? "#16a34a" : "#aaa",
                }}>
                  {c.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}