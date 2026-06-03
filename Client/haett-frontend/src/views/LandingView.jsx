


export default function LandingView({ onLoginClick }) {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <div style={{
        display: "inline-block",
        background: "#fff0f1",
        color: "#e63946",
        padding: "6px 16px",
        borderRadius: "100px",
        fontSize: "13px",
        fontWeight: 600,
        marginBottom: "24px",
        letterSpacing: "0.5px",
      }}>
        PARTNER PROGRAMME
      </div>

      <h1 style={{ fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 800, color: "#1a1a2e", margin: "0 0 20px", lineHeight: 1.1 }}>
        Grow together with <span style={{ color: "#e63946" }}>Haett</span>
      </h1>

      <p style={{ fontSize: "18px", color: "#555", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
        Join our affiliate programme as an influencer, gym, or business partner.
        Share exclusive discount codes with your audience and earn together.
      </p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" }}>
        {[
          { icon: "🎯", title: "Unique Discount Codes", desc: "Get personalised codes to share with your audience" },
          { icon: "📊", title: "Track Performance", desc: "See how many orders your codes have generated" },
          { icon: "🤝", title: "5 Partner Types", desc: "Affiliate, Influencer, Gym, Corporate, and more" },
        ].map((item) => (
          <div key={item.title} style={{
            background: "#fff",
            border: "1.5px solid #f0f0f0",
            borderRadius: "16px",
            padding: "24px 20px",
            flex: "1",
            minWidth: "180px",
            maxWidth: "220px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e", marginBottom: "6px" }}>{item.title}</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onLoginClick}
        style={{
          padding: "15px 44px",
          background: "#e63946",
          color: "#fff",
          border: "none",
          borderRadius: "100px",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(230,57,70,0.35)",
        }}
      >
        Apply Now →
      </button>

      <p style={{ marginTop: "14px", fontSize: "13px", color: "#aaa" }}>
        Already a partner?{" "}
        <button onClick={onLoginClick} style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", fontWeight: 600, padding: 0 }}>
          Sign in
        </button>
      </p>
    </div>
  );
}