import type { ReactNode } from "react";
import { Bell, CircleHelp, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import type { PageName } from "../../types";

const pageCopy: Record<PageName, { title: string; subtitle: string }> = {
  Dashboard: {
    title: "Financial Overview",
    subtitle: "Track giving, spending, and remaining ministry balance.",
  },
  Income: {
    title: "Income Management",
    subtitle: "Record and update real church income across multiple funds.",
  },
  Expenses: {
    title: "Expense Management",
    subtitle: "Manage spending records, operational costs, and ministry use.",
  },
  Reports: {
    title: "Monthly Financial Report",
    subtitle: "Print and export stewardship summaries for church leadership.",
  },
  Settings: {
    title: "System Settings",
    subtitle: "Maintain administrator access, categories, and offline backups.",
  },
};

interface LayoutProps {
  children: ReactNode;
  currentPage: PageName;
  onLogout: () => void;
  setPage: (page: PageName) => void;
}

export default function Layout({
  children,
  currentPage,
  onLogout,
  setPage,
}: LayoutProps) {
  const copy = pageCopy[currentPage];

  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} setPage={setPage} />
      <main className="app-main">
        <header className="topbar">
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
            <div className="user-chip">
              <div className="user-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <span>Church Office</span>
              </div>
            </div>
            <button className="ghost-button" type="button" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <section className="page-body">{children}</section>
      </main>
    </div>
  );
}
