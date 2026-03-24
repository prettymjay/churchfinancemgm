import { useRef, useState } from "react";
import { DatabaseBackup, ShieldCheck, Upload } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import type { BackupPayload, TransactionType } from "../../types";
import {
  addCategory,
  createBackupPayload,
  deleteCategory,
  downloadTextFile,
  getCategories,
  getCredentials,
  getLastBackup,
  restoreBackupPayload,
  setLastBackup,
  updateCredentials,
} from "../../utils/storage";

const colorChoices = ["#11408e", "#248232", "#7a3200", "#b86200", "#6c7280"];

interface SettingsProps {
  onDataChange: () => void;
  onNotify: (message: string) => void;
  refreshKey: number;
}

export default function Settings({ onDataChange, onNotify, refreshKey }: SettingsProps) {
  void refreshKey;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [credentials, setCredentials] = useState(getCredentials());
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<TransactionType>("income");
  const [categoryColor, setCategoryColor] = useState(colorChoices[0]);
  const [message, setMessage] = useState("");

  const categories = getCategories();
  const lastBackup = getLastBackup();

  const handleCredentialSave = () => {
    updateCredentials(credentials);
    setMessage("Administrator credentials updated.");
    onNotify("Updated Successfully");
  };

  const handleBackup = () => {
    const payload = createBackupPayload();
    downloadTextFile(
      `church-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
    setLastBackup(new Date().toISOString());
    setMessage("Offline backup exported successfully.");
  };

  const handleRestore = async (file?: File) => {
    if (!file) {
      return;
    }

    const text = await file.text();
    restoreBackupPayload(JSON.parse(text) as BackupPayload);
    setMessage("Backup restored successfully.");
    onDataChange();
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      return;
    }

    addCategory(categoryName, categoryType, categoryColor);
    setCategoryName("");
    setMessage("Category added to offline ledger.");
    onDataChange();
    onNotify("Successfully Saved");
  };

  return (
    <div className="page-grid">
      <div className="settings-grid">
        <Card>
          <div className="panel-header">
            <h3>User Authentication</h3>
          </div>
          <div className="form-grid">
            <label className="field-label">Login Username</label>
            <input
              className="app-input"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
            />

            <label className="field-label">Access Password</label>
            <input
              className="app-input"
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />

            <Button icon={<ShieldCheck size={16} />} onClick={handleCredentialSave}>
              Update Credentials
            </Button>
          </div>
        </Card>

        <div className="settings-status-stack">
          <div className="hero-card blue tall">
            <span>Sanctuary Mode</span>
            <strong>Working Offline</strong>
            <p>Local storage active and ready for church bookkeeping.</p>
          </div>
          <div className="hero-card green compact">
            <span>Last Backup</span>
            <strong>
              {lastBackup
                ? new Date(lastBackup).toLocaleString("en-US")
                : "No backup yet"}
            </strong>
          </div>
        </div>
      </div>

      {message ? <div className="message-banner">{message}</div> : null}

      <div className="split-panels">
        <Card>
          <div className="panel-header">
            <h3>Backup Database</h3>
          </div>
          <p className="muted-copy">
            Export all transactions, categories, and credentials into an offline
            backup file that can be restored later.
          </p>
          <Button icon={<DatabaseBackup size={16} />} onClick={handleBackup}>
            Start Export
          </Button>
        </Card>

        <Card>
          <div className="panel-header">
            <h3>Restore from Backup</h3>
          </div>
          <p className="muted-copy">
            Import a previously exported JSON backup to recover the church
            ledger on this device.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden-input"
            onChange={(event) => handleRestore(event.target.files?.[0])}
          />
          <Button
            icon={<Upload size={16} />}
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Backup File
          </Button>
        </Card>
      </div>

      <Card>
        <div className="panel-header">
          <h3>Category Management</h3>
        </div>

        <div className="toolbar category-toolbar">
          <input
            className="app-input"
            placeholder="New category name"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
          />
          <select
            className="toolbar-select"
            value={categoryType}
            onChange={(event) => setCategoryType(event.target.value as TransactionType)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="toolbar-select"
            value={categoryColor}
            onChange={(event) => setCategoryColor(event.target.value)}
          >
            {colorChoices.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <Button onClick={handleAddCategory}>+ New Category</Button>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-meta">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <strong>{category.name}</strong>
                  <span>{category.type === "income" ? "Income Channel" : "Expense Channel"}</span>
                </div>
              </div>
              <button
                type="button"
                className="text-button danger-text"
                onClick={() => {
                  deleteCategory(category.id);
                  setMessage("Category removed.");
                  onDataChange();
                  onNotify("Successfully Deleted");
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
