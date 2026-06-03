import { useState, useEffect } from "react";
import {
  getApplications,
  approveApplication,
  rejectApplication,
  getPartnerCodes,
  toggleCode,
} from "../api";

const TABS = ["all", "pending", "approved", "rejected"];

export default function AdminView({ showToast }) {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [codes, setCodes] = useState({}); // { appId: [...codes] }

  const loadApps = async (status = activeTab) => {
    setLoading(true);
    const res = await getApplications(status);
    if (res.success) setApplications(res.applications);
    setLoading(false);
  };

  useEffect(() => {
    loadApps(activeTab);
  }, [activeTab]);

  const handleApprove = async (id) => {
    const res = await approveApplication(id);
    if (res.success) {
      showToast("Application approved ✓");
      loadApps(activeTab);
    } else {
      showToast(res.message || "Error approving", "error");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    const res = await rejectApplication(id, rejectReason);
    if (res.success) {
      showToast("Application rejected");
      setRejectingId(null);
      setRejectReason("");
      loadApps(activeTab);
    } else {
      showToast(res.message || "Error rejecting", "error");
    }
  };

  const loadCodes = async (appId) => {
    if (codes[appId]) {
      setCodes((c) => { const n = { ...c }; delete n[appId]; return n; });
      return;
    }
    const res = await getPartnerCodes(appId);
    if (res.success) setCodes((c) => ({ ...c, [appId]: res.codes }));
  };

  const handleToggle = async (codeId, appId) => {
    const res = await toggleCode(codeId);
    if (res.success) {
      setCodes((c) => ({
        ...c,
        [appId]: c[appId].map((code) => code._id === codeId ? res.code : code),
      }));
      showToast(`Code ${res.code.isActive ? "activated" : "deactivated"}`);
    }
  };

  const counts = TABS.reduce((acc, t) => {
    if (t === "all") acc[t] = applications.length;
    else acc[t] = applications.filter((a) => a.status === t).length;
    return acc;
  }, {});

  // When on "all" tab we show all; otherwise filter locally for count display
  const visible = applications;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>
        Admin Panel
      </h2>
      <p style={{ color: "#888", fontSize: "14px", margin: "0 0 28px" }}>
        Review and manage partner applications
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "8px 18px",
              borderRadius: "100px",
              border: "1.5px solid",
              borderColor: activeTab === t ? "#e63946" : "#e5e7eb",
              background: activeTab === t ? "#e63946" : "#fff",
              color: activeTab === t ? "#fff" : "#666",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t} {activeTab === t ? `(${visible.length})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: "60px" }}>Loading...</p>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#aaa", fontSize: "14px" }}>
          No applications found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {visible.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onApprove={handleApprove}
              onRejectStart={() => { setRejectingId(app._id); setRejectReason(""); }}
              onRejectConfirm={handleReject}
              onRejectCancel={() => setRejectingId(null)}
              isRejecting={rejectingId === app._id}
              rejectReason={rejectReason}
              onReasonChange={setRejectReason}
              appCodes={codes[app._id]}
              onToggleCodes={() => loadCodes(app._id)}
              onToggleCode={(codeId) => handleToggle(codeId, app._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({
  app, onApprove, onRejectStart, onRejectConfirm, onRejectCancel,
  isRejecting, rejectReason, onReasonChange,
  appCodes, onToggleCodes, onToggleCode,
}) {
  const user = app.userId;

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #f0f0f0",
      borderRadius: "14px",
      padding: "20px 24px",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#1a1a2e" }}>
              {user?.name || "—"}
            </span>
            <StatusBadge status={app.status} />
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>{user?.email}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: "13px", color: "#888" }}>
          <div style={{ fontWeight: 600, color: "#444" }}>{app.partnerType}</div>
          <div>{app.businessName}</div>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "14px", fontSize: "13px", color: "#666" }}>
        {app.socialLink && <span>🔗 <a href={app.socialLink} target="_blank" rel="noreferrer" style={{ color: "#e63946" }}>Social Link</a></span>}
        {app.audienceSize && <span>👥 {app.audienceSize.toLocaleString()} audience</span>}
        {app.contactPhone && <span>📞 {app.contactPhone}</span>}
      </div>

      {app.description && (
        <p style={{ fontSize: "13px", color: "#666", margin: "12px 0 0", lineHeight: 1.6, background: "#fafafa", padding: "10px 14px", borderRadius: "8px" }}>
          {app.description}
        </p>
      )}

      {/* Rejection reason (if rejected) */}
      {app.status === "rejected" && app.rejectionReason && (
        <p style={{ fontSize: "13px", color: "#ef4444", margin: "12px 0 0" }}>
          <strong>Reason:</strong> {app.rejectionReason}
        </p>
      )}

      {/* Reject inline form */}
      {isRejecting && (
        <div style={{ marginTop: "14px", background: "#fff5f5", borderRadius: "10px", padding: "14px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600, color: "#ef4444" }}>
            Provide a reason for rejection:
          </p>
          <textarea
            style={{
              width: "100%", padding: "10px 12px", border: "1.5px solid #fecaca",
              borderRadius: "8px", fontSize: "13px", boxSizing: "border-box",
              resize: "none", height: "80px", outline: "none", fontFamily: "inherit",
            }}
            placeholder="e.g. Audience size too small for our current programme..."
            value={rejectReason}
            onChange={(e) => onReasonChange(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => onRejectConfirm(app._id)}
              disabled={!rejectReason.trim()}
              style={{
                padding: "8px 18px", background: "#ef4444", color: "#fff",
                border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600,
                cursor: rejectReason.trim() ? "pointer" : "not-allowed",
                opacity: rejectReason.trim() ? 1 : 0.5,
              }}
            >
              Confirm Reject
            </button>
            <button
              onClick={onRejectCancel}
              style={{ padding: "8px 18px", background: "#f0f0f0", color: "#444", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {app.status === "pending" && !isRejecting && (
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button onClick={() => onApprove(app._id)} style={approveBtn}>✓ Approve</button>
          <button onClick={onRejectStart} style={rejectBtn}>✕ Reject</button>
        </div>
      )}

      {/* View codes (approved) */}
      {app.status === "approved" && (
        <div style={{ marginTop: "16px" }}>
          <button
            onClick={onToggleCodes}
            style={{ background: "none", border: "none", color: "#e63946", fontWeight: 600, fontSize: "13px", cursor: "pointer", padding: 0 }}
          >
            {appCodes ? "▲ Hide Codes" : "▼ View Codes"}
          </button>

          {appCodes && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {appCodes.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#aaa" }}>No codes assigned yet</p>
              ) : appCodes.map((c) => (
                <div key={c._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#fafafa", borderRadius: "8px", padding: "10px 14px",
                  flexWrap: "wrap", gap: "8px",
                }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px", letterSpacing: "1px" }}>{c.code}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`} · Used {c.usedCount}×
                    </span>
                    <button
                      onClick={() => onToggleCode(c._id)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        border: "1.5px solid",
                        borderColor: c.isActive ? "#fca5a5" : "#86efac",
                        background: c.isActive ? "#fff5f5" : "#f0fdf4",
                        color: c.isActive ? "#ef4444" : "#16a34a",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:  { bg: "#fef9c3", color: "#a16207" },
    approved: { bg: "#f0fdf4", color: "#16a34a" },
    rejected: { bg: "#fff5f5", color: "#ef4444" },
  };
  const s = styles[status] || {};
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: "100px",
      fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

const approveBtn = {
  padding: "8px 18px", background: "#16a34a", color: "#fff",
  border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
};

const rejectBtn = {
  padding: "8px 18px", background: "#fff", color: "#ef4444",
  border: "1.5px solid #fecaca", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
};