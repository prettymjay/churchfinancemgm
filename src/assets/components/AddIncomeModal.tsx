import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import type { Category, Transaction, TransactionFormValues } from "../../types";

interface AddIncomeModalProps {
  categories: Category[];
  initialData?: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: TransactionFormValues, id?: string) => void;
}

const createEmptyForm = (): TransactionFormValues => ({
  amount: 0,
  category: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
});

export default function AddIncomeModal({
  categories,
  initialData,
  isOpen,
  onClose,
  onSave,
}: AddIncomeModalProps) {
  const [form, setForm] = useState<TransactionFormValues>(createEmptyForm());

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        description: initialData.description,
      });
      return;
    }

    setForm(createEmptyForm());
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!form.amount || !form.category || !form.date) {
      return;
    }

    onSave(form, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Income Record" : "Record New Income"}
    >
      <div className="modal-form">
        <label className="field-label">Amount</label>
        <input
          className="app-input"
          type="number"
          min="0"
          value={form.amount || ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              amount: Number(event.target.value),
            }))
          }
        />

        <label className="field-label">Category</label>
        <select
          className="app-input"
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
        >
          <option value="">Select income category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="field-label">Date</label>
        <input
          className="app-input"
          type="date"
          value={form.date}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              date: event.target.value,
            }))
          }
        />

        <label className="field-label">Notes</label>
        <textarea
          className="app-input"
          rows={4}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Income" : "Save Income"}
        </Button>
      </div>
    </Modal>
  );
}
