import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import AddExpenseModal from "./AddExpenseModal";

export default function Expenses() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/expenses");
    setData(res || []);
  };

  // SAVE (ADD OR UPDATE)
  const save = async (form: any) => {
    if (editData) {
      await api.put(`/expenses/${editData.id}`, form);
    } else {
      await api.post("/expenses", form);
    }
    setEditData(null);
    load();
  };

  const remove = async (id: number) => {
    await api.delete(`/expenses${id}`);
    load();
  };

  const openAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditData(item);
    setOpen(true);
  };

  return (
    <div>
      <h1>Expenses Management</h1>

      <button onClick={openAdd} style={addBtn}>
        + Record New Offering
      </button>

      {/* TABLE */}
      <div style={{ marginTop: 20, background: "#fff", borderRadius: 10 }}>
        {data.slice(0, 5).map((i) => (
          <div key={i.id} style={row}>
            <div>{i.date}</div>
            <div>{i.category}</div>
            <div>₱{i.amount}</div>

            <div>
              <button onClick={() => openEdit(i)} style={editBtn}>
                Edit
              </button>
              <button onClick={() => remove(i.id)} style={deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <AddExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={save}
        editData={editData}
      />
    </div>
  );
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: 15,
  borderBottom: "1px solid #eee",
};

const addBtn = {
  background: "#1e3a8a",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const editBtn = {
  marginRight: 10,
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
};