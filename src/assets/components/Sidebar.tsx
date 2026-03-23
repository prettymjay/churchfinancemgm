import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Income", path: "/income" },
    { name: "Expenses", path: "/expenses" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div
      style={{
        width: 220,
        background: "#fff",
        padding: 20,
        borderRight: "1px solid #eee",
      }}
    >
      <h2>The Sacred Ledger</h2>

      {menu.map((m) => (
        <Link
          key={m.path}
          to={m.path}
          style={{
            display: "block",
            padding: 10,
            marginTop: 10,
            borderRadius: 8,
            background: pathname === m.path ? "#1e3a8a" : "transparent",
            color: pathname === m.path ? "#fff" : "#000",
            textDecoration: "none",
          }}
        >
          {m.name}
        </Link>
      ))}
    </div>
  );
}