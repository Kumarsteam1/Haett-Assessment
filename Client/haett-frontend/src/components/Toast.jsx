import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#f59e0b";

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      background: bg,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: 600,
      fontSize: "14px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      zIndex: 9999,
      animation: "slideUp 0.3s ease",
    }}>
      {message}
    </div>
  );
}