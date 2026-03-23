import { useState } from "react";
import { api } from "../../utils/api";

export default function AddIncomeModal({ onClose, onSaved }: any) {
  const [form, setForm] = useState({
    date: "",
    category: "Offering",
    amount: "",
  });

  const save = async () => {
    if (!form.date || !form.amount) {
      alert("Fill all fields");
      return;
    }

    await api.post("/income", form);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Add Income
        </h2>

        {/* DATE */}
        <input
          type="date"
          className="w-full border p-3 rounded-lg mb-3"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        {/* CATEGORY */}
        <select
          className="w-full border p-3 rounded-lg mb-3"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option>Offering</option>
          <option>Tithes</option>
          <option>Mission</option>
          <option>Building Fund</option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <button
          onClick={save}
          className="w-full bg-blue-900 text-white py-3 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}