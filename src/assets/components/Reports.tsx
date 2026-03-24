import { useMemo, useState } from "react";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { Download, Printer } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { getCategories, getTransactions } from "../../utils/storage";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

interface ReportsProps {
  refreshKey: number;
}

const getMonthValue = (date: Date) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;

export default function Reports({ refreshKey }: ReportsProps) {
  void refreshKey;
  const transactions = getTransactions();
  const categories = getCategories();

  const monthOptions = useMemo(() => {
    const values = new Set(transactions.map((item) => item.date.slice(0, 7)));
    values.add(getMonthValue(new Date()));
    return [...values].sort().reverse();
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const monthTransactions = transactions.filter((item) => item.date.startsWith(selectedMonth));

  const availableCategories = categories.filter((category) => {
    const categoryUsedThisMonth = monthTransactions.some(
      (item) => item.category === category.name,
    );

    if (selectedType === "all") {
      return categoryUsedThisMonth;
    }

    return category.type === selectedType && categoryUsedThisMonth;
  });

  const filteredTransactions = monthTransactions.filter((item) => {
    const matchesType = selectedType === "all" ? true : item.type === selectedType;
    const matchesCategory = selectedCategory === "all" ? true : item.category === selectedCategory;
    const matchesFrom = dateFrom ? item.date >= dateFrom : true;
    const matchesTo = dateTo ? item.date <= dateTo : true;
    return matchesType && matchesCategory && matchesFrom && matchesTo;
  });

  const income = filteredTransactions.filter((item) => item.type === "income");
  const expenses = filteredTransactions.filter((item) => item.type === "expense");

  const totalIncome = income.reduce((total, item) => total + item.amount, 0);
  const totalExpenses = expenses.reduce((total, item) => total + item.amount, 0);
  const surplus = totalIncome - totalExpenses;

  const incomeRows = Object.entries(
    income.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.category] = (accumulator[item.category] ?? 0) + item.amount;
      return accumulator;
    }, {}),
  );

  const expenseRows = Object.entries(
    expenses.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.category] = (accumulator[item.category] ?? 0) + item.amount;
      return accumulator;
    }, {}),
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    const document = new jsPDF();

    document.setFontSize(20);
    document.text("Monthly Financial Report", 14, 20);
    document.setFontSize(11);
    document.text(`Report period: ${selectedMonth}`, 14, 28);
    document.text(`Type filter: ${selectedType}`, 14, 34);
    document.text(`Category filter: ${selectedCategory}`, 14, 40);
    document.text(`Date range: ${dateFrom || "start"} to ${dateTo || "end"}`, 14, 46);
    document.text(`Total income: ${currency.format(totalIncome)}`, 14, 54);
    document.text(`Total expenses: ${currency.format(totalExpenses)}`, 14, 60);
    document.text(`Net balance: ${currency.format(surplus)}`, 14, 66);

    autoTable(document, {
      startY: 76,
      head: [["Type", "Date", "Category", "Description", "Amount"]],
      body: filteredTransactions.map((item) => [
        item.type,
        item.date,
        item.category,
        item.description,
        currency.format(item.amount),
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [17, 64, 142],
      },
    });

    document.save(`church-report-${selectedMonth}.pdf`);
  };

  return (
    <div className="page-grid">
      <div className="reports-filters">
        <div className="reports-toolbar">
          <div className="period-select">
            <label className="field-label" htmlFor="report-month">
              Report Period
            </label>
            <select
              id="report-month"
              className="app-input"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="toolbar-actions">
            <Button icon={<Printer size={16} />} variant="secondary" onClick={handlePrint}>
              Print Report
            </Button>
            <Button icon={<Download size={16} />} onClick={handleExportPdf}>
              Export to PDF
            </Button>
          </div>
        </div>

        <div className="toolbar reports-toolbar-row">
          <select
            className="toolbar-select"
            value={selectedType}
            onChange={(event) => {
              const nextType = event.target.value as "all" | "income" | "expense";
              setSelectedType(nextType);
              setSelectedCategory("all");
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <select
            className="toolbar-select"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="app-input report-date-input"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
          <input
            type="date"
            className="app-input report-date-input"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>
      </div>

      <Card className="report-card">
        <div className="panel-header report-header">
          <div>
            <h2>Monthly Financial Summary</h2>
            <p>Filtered church financial statement for {selectedMonth}</p>
          </div>
          <span className="status-badge online">Audited Offline Copy</span>
        </div>

        <div className="stats-grid reports">
          <Card>
            <span>Total Income</span>
            <strong>{currency.format(totalIncome)}</strong>
          </Card>
          <Card>
            <span>Total Expenses</span>
            <strong>{currency.format(totalExpenses)}</strong>
          </Card>
          <div className="hero-card blue">
            <span>Net Balance</span>
            <strong>{currency.format(surplus)}</strong>
            <p>Based on the currently selected filters</p>
          </div>
        </div>

        <div className="report-breakdowns">
          <div>
            <h3>Income Breakdown</h3>
            <div className="mini-table">
              {incomeRows.map(([category, amount]) => (
                <div key={category} className="mini-row">
                  <span>{category}</span>
                  <strong>{currency.format(amount)}</strong>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Primary Expenses</h3>
            <div className="mini-table">
              {expenseRows.map(([category, amount]) => (
                <div key={category} className="mini-row">
                  <span>{category}</span>
                  <strong>{currency.format(amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.type}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td className={item.type === "income" ? "money-in" : "money-out"}>
                    {currency.format(item.amount)}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state-cell">
                    No transactions match the selected report filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
