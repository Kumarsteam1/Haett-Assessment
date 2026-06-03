
// import './App.css'

// function App() {

//   return (
  
//   )
// }

// export default App


import { useState, useEffect } from "react";
import { getMe, getMyApplication } from "./api";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import LandingView from "./views/LandingView";
import ApplicationFormView from "./views/ApplicationFormView";
import PendingView from "./views/PendingView";
import RejectedView from "./views/RejectedView";
import DashboardView from "./views/DashboardView";
import AdminView from "./views/AdminView";

export default function App() {
  const [user, setUser] = useState(null);           // logged-in user object
  const [application, setApplication] = useState(null); // partner application
  const [view, setView] = useState("loading");      // which view to show
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState(null);         // { message, type }

  // On mount — check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setView("landing");
      return;
    }
    bootstrapUser();
  }, []);

  const bootstrapUser = async () => {
    const meRes = await getMe();
    if (!meRes.success) {
      localStorage.removeItem("token");
      setView("landing");
      return;
    }

    const loggedInUser = meRes.user;
    setUser(loggedInUser);

    if (loggedInUser.role === "admin") {
      setView("admin");
      return;
    }

    // Fetch their application
    const appRes = await getMyApplication();
    if (!appRes.success) {
      // No application yet
      setView("apply");
      return;
    }

    const app = appRes.application;
    setApplication(app);

    if (app.status === "pending") setView("pending");
    else if (app.status === "rejected") setView("rejected");
    else if (app.status === "approved") setView("dashboard");
    else setView("apply");
  };

  const handleLoginSuccess = (loggedInUser) => {
    setShowLogin(false);
    setUser(loggedInUser);
    // Re-bootstrap to load application state
    bootstrapUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setApplication(null);
    setView("landing");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ── Render ──────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top nav */}
      <nav style={{
        background: "#fff",
        borderBottom: "1.5px solid #f0f0f0",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ fontWeight: 800, fontSize: "20px", color: "#e63946", letterSpacing: "-0.5px" }}>
          haett
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <>
              <span style={{ fontSize: "13px", color: "#888" }}>
                {user.name}
                {user.role === "admin" && (
                  <span style={{ marginLeft: "6px", background: "#fef9c3", color: "#a16207", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                    ADMIN
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "7px 16px", background: "#f5f5f5", color: "#555",
                  border: "none", borderRadius: "8px", fontSize: "13px",
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: "8px 20px", background: "#e63946", color: "#fff",
                border: "none", borderRadius: "8px", fontSize: "13px",
                fontWeight: 700, cursor: "pointer",
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main>
        {view === "loading" && (
          <div style={{ textAlign: "center", padding: "120px", color: "#aaa" }}>Loading...</div>
        )}

        {view === "landing" && (
          <LandingView onLoginClick={() => setShowLogin(true)} />
        )}

        {view === "apply" && (
          <ApplicationFormView
            onSuccess={(app) => { setApplication(app); setView("pending"); }}
            showToast={showToast}
          />
        )}

        {view === "pending" && (
          <PendingView application={application} />
        )}

        {view === "rejected" && (
          <RejectedView
            application={application}
            onReapply={() => setView("apply")}
          />
        )}

        {view === "dashboard" && (
          <DashboardView application={application} showToast={showToast} />
        )}

        {view === "admin" && (
          <AdminView showToast={showToast} />
        )}
      </main>

      {/* Login modal */}
      {showLogin && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #e63946 !important;
        }
      `}</style>
    </div>
  );
}