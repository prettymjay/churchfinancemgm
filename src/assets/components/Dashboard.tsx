import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [income, setIncome] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const i = await api.get("/income");
    const e = await api.get("/expenses");

    setIncome(i || []);
    setExpenses(e || []);
  };

  const totalIncome = income.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpenses;

  const recent = [...income, ...expenses].slice(0, 5);

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  return (
    <div>
      <h1>Financial Overview</h1>

      {/* CARDS */}
      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Total Income" value={totalIncome} color="#1e3a8a" />
        <Card title="Total Expenses" value={totalExpenses} color="#ddd" />
        <Card title="Balance" value={balance} color="#166534" />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        <div style={{ flex: 1, background: "#fff", padding: 20 }}>
          <h3>Income vs Expenses</h3>
          <LineChart width={400} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </div>

        <div style={{ flex: 1, background: "#fff", padding: 20 }}>
          <h3>Distribution</h3>
          <PieChart width={300} height={200}>
            <Pie data={chartData} dataKey="value">
              <Cell fill="#1e3a8a" />
              <Cell fill="#ef4444" />
            </Pie>
          </PieChart>
        </div>
      </div>

      {/* RECENT */}
      <div style={{ marginTop: 30, background: "#fff", padding: 20 }}>
        <h3>Recent Entries</h3>

        {recent.map((r, i) => (
          <div key={i} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            {r.category} - ₱{r.amount}
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div
      style={{
        flex: 1,
        background: color,
        color: color === "#ddd" ? "#000" : "#fff",
        padding: 20,
        borderRadius: 10,
      }}
    >
      <h4>{title}</h4>
      <h2>₱{value}</h2>
    </div>
  );
}