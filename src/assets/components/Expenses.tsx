import { useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import Button from "./ui/Button";
import Card from "./ui/Card";
import {
  deleteTransaction,
  getCategories,
  getTransactions,
  upsertTransaction,
} from "../../utils/storage";
import type { Transaction, TransactionFormValues } from "../../types";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

interface ExpensesProps {
  onDataChange: () => void;
  onNotify: (message: string) => void;
  refreshKey: number;
}

export default function Expenses({ onDataChange, onNotify, refreshKey }: ExpensesProps) {
  void refreshKey;
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const categories = getCategories().filter((category) => category.type === "expense");
  const records = getTransactions().filter((transaction) => transaction.type === "expense");

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const lowerQuery = query.toLowerCase();
        return (
          record.description.toLowerCase().includes(lowerQuery) ||
          record.category.toLowerCase().includes(lowerQuery)
        );
      }),
    [records, query],
  );

  const totalExpenses = records.reduce((total, item) => total + item.amount, 0);
  const remainingBudget = Math.max(
    0,
    getTransactions()
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount, 0) - totalExpenses,
  );

  const handleSave = (values: TransactionFormValues, id?: string) => {
    upsertTransaction("expense", values, id);
    setIsOpen(false);
    setEditing(null);
    onDataChange();
    onNotify(id ? "Updated Successfully" : "Successfully Saved");
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    onDataChange();
    onNotify("Successfully Deleted");
  };

  return (
    <div className="page-grid">
      <div className="stats-grid expenses">
        <Card className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Monthly Expenses</span>
            <strong className="metric-value metric-value-compact">{currency.format(totalExpenses)}</strong>
          </div>
          <p className="danger-copy">Updated from offline bookkeeping records</p>
        </Card>
        <Card className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Recorded Entries</span>
            <strong className="metric-value metric-value-compact">{records.length.toString().padStart(2, "0")}</strong>
          </div>
          <p>All expenses are saved locally on this device.</p>
        </Card>
        <div className="hero-card blue">
          <span>Remaining Budget</span>
          <strong>{currency.format(remainingBudget)}</strong>
          <p>Available funds after current expenses</p>
        </div>
      </div>

      <Card>
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              className="search-input"
              placeholder="Search by vendor or description..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button type="button" className="button secondary small">
            <Filter size={16} />
            Filter
          </button>
          <Button
            icon={<Plus size={16} />}
            onClick={() => {
              setEditing(null);
              setIsOpen(true);
            }}
          >
            Record New Expense
          </Button>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString("en-US")}</td>
                  <td>{record.description}</td>
                  <td>
                    <span className="table-pill expense">{record.category}</span>
                  </td>
                  <td className="money-out">{currency.format(record.amount)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => {
                          setEditing(record);
                          setIsOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-button danger-text"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state-cell">
                    No expense records found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="split-panels">
        <Card>
          <div className="panel-header">
            <h3>Spending by Category</h3>
          </div>
          <div className="stack-list">
            {categories.map((category) => {
              const amount = records
                .filter((item) => item.category === category.name)
                .reduce((total, item) => total + item.amount, 0);
              const ratio = totalExpenses ? (amount / totalExpenses) * 100 : 0;

              return (
                <div key={category.id} className="stack-item">
                  <div className="stack-header">
                    <span>{category.name}</span>
                    <strong>{currency.format(amount)}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${ratio}%`, backgroundColor: category.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="panel-header">
            <h3>Policy Reminder</h3>
          </div>
          <p className="muted-copy">
            Keep official receipts for major purchases and review ministry
            expenses before month-end reporting. This ledger is fully offline,
            so device backups are important.
          </p>
        </Card>
      </div>

      <AddExpenseModal
        categories={categories}
        initialData={editing}
        isOpen={isOpen}
        onClose={() => {
          setEditing(null);
          setIsOpen(false);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
