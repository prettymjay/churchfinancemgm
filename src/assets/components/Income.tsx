import { useEffect, useState } from "react";
import AddIncomeModal from "./AddIncomeModal"; // (if outside ui)
import EditIncomeModal from "./ui/EditIncomeModal";
import { getIncome } from "../../utils/storage";

export default function Income() {
  const [data, setData] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const load = () => {
    const res = getIncome();
    setData(res);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔍 FILTER LOGIC (date + category)
  const filtered = data.filter((item) => {
    const matchSearch =
      item.date.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category ? item.category === category : true;

    return matchSearch && matchCategory;
  });

  // 💰 TOTAL
  const total = data.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="flex h-full bg-gray-100">

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Income Management</h1>

          <div className="flex gap-4 items-center">
            <span>🔔</span>
            <span>❓</span>
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* SUMMARY + ACTION */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* TOTAL */}
          <div className="bg-white p-5 rounded-xl col-span-2">
            <p className="text-sm text-gray-500">TOTAL MONTHLY GIVING</p>
            <h2 className="text-3xl font-bold mt-2">
              ₱{total.toLocaleString()}
            </h2>

            <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded mt-2 inline-block">
              +12.4%
            </span>
          </div>

          {/* ACTION */}
          <div className="bg-blue-900 text-white rounded-xl p-5 flex flex-col justify-center items-center">
            <p className="text-sm mb-3">QUICK ACTION</p>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium"
            >
              + Add New Record
            </button>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by date or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Tithes">Tithes</option>
            <option value="Missions">Missions</option>
            <option value="Building Fund">Building Fund</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Notes</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr key={index} className="border-t">

                  <td className="p-3">{item.date}</td>

                  <td className="p-3 font-semibold text-green-600">
                    ₱{Number(item.amount).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-gray-200">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">{item.notes}</td>

                  <td className="p-3">
                    <button
                      onClick={() => setEditItem(item)}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        const updated = data.filter((_, i) => i !== index);
                        localStorage.setItem("income", JSON.stringify(updated));
                        load();
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="flex justify-between items-center p-3 text-sm text-gray-500">
            <span>Showing {filtered.length} entries</span>

            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded">‹</button>
              <button className="px-2 py-1 border rounded">›</button>
            </div>
          </div>

        </div>
      </div>

      {/* MODALS */}
      {showAdd && (
        <AddIncomeModal
          onClose={() => setShowAdd(false)}
          onSaved={load}
        />
      )}

      {editItem && (
        <EditIncomeModal
          data={editItem}
          onClose={() => setEditItem(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}