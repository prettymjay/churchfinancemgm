import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Wallet,
} from "lucide-react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./ui/Card";
import { getCategories, getTransactions } from "../../utils/storage";
import type { Transaction } from "../../types";

interface DashboardProps {
  refreshKey: number;
}

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

const monthLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short" }).toUpperCase();

export default function Dashboard({ refreshKey }: DashboardProps) {
  void refreshKey;
  const transactions = getTransactions();
  const categories = getCategories();

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);
  const balance = income - expenses;

  const groupedByMonth = transactions.reduce<Record<string, { income: number; expense: number }>>(
    (accumulator, item) => {
      const key = monthLabel(item.date);
      if (!accumulator[key]) {
        accumulator[key] = { income: 0, expense: 0 };
      }

      accumulator[key][item.type] += item.amount;
      return accumulator;
    },
    {},
  );

  const trendData = Object.entries(groupedByMonth).map(([month, values]) => ({
    month,
    income: values.income,
    expense: values.expense,
  }));

  const incomeBreakdown = categories
    .filter((category) => category.type === "income")
    .map((category) => ({
      name: category.name,
      value: transactions
        .filter((item) => item.type === "income" && item.category === category.name)
        .reduce((total, item) => total + item.amount, 0),
      color: category.color,
    }))
    .filter((item) => item.value > 0);

  const recentEntries = [...transactions]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);

  return (
    <div className="page-grid">
      <div className="stats-grid">
        <div className="hero-card blue">
          <span>Total Income</span>
          <strong>{currency.format(income)}</strong>
          <p>
            <ArrowUpRight size={16} />
            Stewardship inflow across all active funds
          </p>
        </div>
        <div className="hero-card">
          <span>Total Expenses</span>
          <strong>{currency.format(expenses)}</strong>
          <p className="danger-copy">
            <ArrowDownRight size={16} />
            Current operating and ministry expenses
          </p>
        </div>
        <div className="hero-card green">
          <span>Remaining Balance</span>
          <strong>{currency.format(balance)}</strong>
          <p>
            <Wallet size={16} />
            Healthy funds available for church work
          </p>
        </div>
      </div>

      <div className="dashboard-panels">
        <Card className="chart-panel">
          <div className="panel-header">
            <h3>Income vs Expenses</h3>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value) => currency.format(Number(value ?? 0))} />
                <Line type="monotone" dataKey="income" stroke="#11408e" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#c26c1a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="allocation-panel">
          <div className="panel-header">
            <h3>Income Allocation</h3>
          </div>
          <div className="chart-area compact">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={incomeBreakdown}
                  innerRadius={64}
                  outerRadius={92}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {incomeBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency.format(Number(value ?? 0))} />
              </PieChart>
            </ResponsiveContainer>

            <div className="legend-list">
              {incomeBreakdown.map((entry) => (
                <div key={entry.name} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                  <strong>{currency.format(entry.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="panel-header">
          <h3>Recent Entries</h3>
          <span className="status-badge online">
            <Landmark size={14} />
            Offline ledger ready
          </span>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((item: Transaction) => (
                <tr key={item.id}>
                  <td>{new Date(item.date).toLocaleDateString("en-US")}</td>
                  <td>
                    <span className={`status-badge ${item.type === "income" ? "online" : "warning"}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td className={item.type === "income" ? "money-in" : "money-out"}>
                    {item.type === "income" ? "+" : "-"}
                    {currency.format(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
