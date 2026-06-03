export default function RejectedView({ application, onReapply }) {
  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>😔</div>
      <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 12px" }}>
        Application Not Approved
      </h2>
      <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, margin: "0 0 28px" }}>
        Unfortunately your application wasn't approved this time.
        You're welcome to update your details and apply again.
      </p>

      {application?.rejectionReason && (
        <div style={{
          background: "#fff5f5",
          border: "1.5px solid #fecaca",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "28px",
          textAlign: "left",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", margin: "0 0 6px", letterSpacing: "0.5px" }}>
            REASON FOR REJECTION
          </p>
          <p style={{ fontSize: "14px", color: "#555", margin: 0, lineHeight: 1.6 }}>
            {application.rejectionReason}
          </p>
        </div>
      )}

      <button
        onClick={onReapply}
        style={{
          padding: "13px 36px",
          background: "#e63946",
          color: "#fff",
          border: "none",
          borderRadius: "100px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(230,57,70,0.3)",
        }}
      >
        Apply Again →
      </button>
    </div>
  );
}