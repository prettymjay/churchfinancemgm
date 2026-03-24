import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import Layout from "./assets/components/Layout";
import Dashboard from "./assets/components/Dashboard";
import Expenses from "./assets/components/Expenses";
import Income from "./assets/components/Income";
import Reports from "./assets/components/Reports";
import Settings from "./assets/components/Settings";
import Button from "./assets/components/ui/Button";
import ToastViewport from "./assets/components/ui/ToastViewport";
import type { PageName } from "./types";
import { bootstrapOfflineStore, getCredentials } from "./utils/storage";

const SESSION_KEY = "church_finance_session";

export default function App() {
  const [page, setPage] = useState<PageName>("Dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem(SESSION_KEY) === "authenticated",
  );
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    bootstrapOfflineStore();
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleDataChange = () => {
    setRefreshKey((current) => current + 1);
  };

  const handleNotify = (message: string) => {
    setToastMessage(message);
  };

  const handleLogin = () => {
    const credentials = getCredentials();
    if (
      loginForm.username.trim() === credentials.username &&
      loginForm.password === credentials.password
    ) {
      sessionStorage.setItem(SESSION_KEY, "authenticated");
      setIsAuthenticated(true);
      setLoginError("");
      return;
    }

    setLoginError("Invalid administrator credentials.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
  };

  const pageContent = useMemo(() => {
    const commonProps = {
      refreshKey,
      onDataChange: handleDataChange,
      onNotify: handleNotify,
    };

    switch (page) {
      case "Income":
        return <Income {...commonProps} />;
      case "Expenses":
        return <Expenses {...commonProps} />;
      case "Reports":
        return <Reports refreshKey={refreshKey} />;
      case "Settings":
        return <Settings {...commonProps} />;
      default:
        return <Dashboard refreshKey={refreshKey} />;
    }
  }, [page, refreshKey]);

  if (!isAuthenticated) {
    return (
      <div className="login-shell">
        <div className="login-panel">
          <div className="login-badge">
            <LockKeyhole size={18} />
            Offline Church Finance
          </div>
          <h1>Church Financial Management System</h1>
          <p>
            Sign in as the administrator to manage income, expenses, reports,
            and offline backups.
          </p>

          <label className="field-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="app-input"
            placeholder="Enter admin username"
            value={loginForm.username}
            onChange={(event) =>
              setLoginForm((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="app-input"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLogin();
              }
            }}
          />

          {loginError ? <div className="form-error">{loginError}</div> : null}

          <Button icon={<LogIn size={18} />} onClick={handleLogin}>
            Login to Dashboard
          </Button>

          <div className="login-help">
            Default access: <strong>admin</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout currentPage={page} setPage={setPage} onLogout={handleLogout}>
        {pageContent}
      </Layout>
      <ToastViewport message={toastMessage} />
    </>
  );
}
