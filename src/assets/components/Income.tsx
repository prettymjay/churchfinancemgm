import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import AddIncomeModal from "./AddIncomeModal";
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

interface IncomeProps {
  onDataChange: () => void;
  onNotify: (message: string) => void;
  refreshKey: number;
}

export default function Income({ onDataChange, onNotify, refreshKey }: IncomeProps) {
  void refreshKey;
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const categories = getCategories().filter((category) => category.type === "income");
  const records = getTransactions().filter((transaction) => transaction.type === "income");

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchesQuery =
          record.description.toLowerCase().includes(query.toLowerCase()) ||
          record.category.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter ? record.category === categoryFilter : true;
        return matchesQuery && matchesCategory;
      }),
    [records, query, categoryFilter],
  );

  const totalIncome = records.reduce((total, item) => total + item.amount, 0);

  const handleSave = (values: TransactionFormValues, id?: string) => {
    upsertTransaction("income", values, id);
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
      <div className="page-hero">
        <Card className="income-summary-card metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Monthly Giving</span>
            <strong className="metric-value">{currency.format(totalIncome)}</strong>
          </div>
          <p className="metric-subtitle">
            <span className="inline-pill positive">Active Offline Ledger</span>
            <span>Ready for real church data entry</span>
          </p>
        </Card>
        <div className="quick-card">
          <span>Quick Action</span>
          <button
            type="button"
            className="quick-button"
            onClick={() => {
              setEditing(null);
              setIsOpen(true);
            }}
          >
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </div>

      <Card>
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              className="search-input"
              placeholder="Search by Category"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="toolbar-select"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString("en-US")}</td>
                  <td className="money-in">{currency.format(record.amount)}</td>
                  <td>
                    <span className="table-pill income">{record.category}</span>
                  </td>
                  <td>{record.description}</td>
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
                      <MoreHorizontal size={18} color="#7b8190" />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state-cell">
                    No income records match your search yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <AddIncomeModal
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
