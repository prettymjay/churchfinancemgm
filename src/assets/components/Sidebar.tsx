import {
  ChartColumnBig,
  CircleDollarSign,
  FileBarChart2,
  ReceiptText,
  Settings,
} from "lucide-react";
import type { PageName } from "../../types";

const menu: Array<{
  icon: typeof ChartColumnBig;
  label: PageName;
}> = [
  { icon: ChartColumnBig, label: "Dashboard" },
  { icon: CircleDollarSign, label: "Income" },
  { icon: ReceiptText, label: "Expenses" },
  { icon: FileBarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

interface SidebarProps {
  currentPage: PageName;
  setPage: (page: PageName) => void;
}

export default function Sidebar({ currentPage, setPage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <h2>Church Financial Management System</h2>
          <span>Offline Church Ledger</span>
        </div>

        <nav className="sidebar-nav">
          {menu.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className={`sidebar-link ${currentPage === label ? "active" : ""}`}
              onClick={() => setPage(label)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div>
            <strong>Admin User</strong>
            <span>Lead Steward</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
