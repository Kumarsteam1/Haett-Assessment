export default function PendingView({ application }) {
  const appliedDate = new Date(application?.appliedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>⏳</div>
      <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 12px" }}>
        Application Under Review
      </h2>
      <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, margin: "0 0 28px" }}>
        Thanks for applying! Our team is reviewing your application.
        You'll hear back within a few business days.
      </p>

      <div style={{
        background: "#fff",
        border: "1.5px solid #f0f0f0",
        borderRadius: "16px",
        padding: "24px",
        textAlign: "left",
      }}>
        <Row label="Status">
          <span style={{ background: "#fef9c3", color: "#a16207", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>
            PENDING
          </span>
        </Row>
        <Row label="Applied On">{appliedDate}</Row>
        <Row label="Partner Type">{application?.partnerType}</Row>
        <Row label="Business Name">{application?.businessName}</Row>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
      <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>{children}</span>
    </div>
  );
}