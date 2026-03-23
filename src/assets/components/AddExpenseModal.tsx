import { useState } from "react"
import { getCategories } from "../../utils/storage"
const categories = getCategories()

const AddExpenseModal = ({ onClose, onSave }: any) => {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      description,
      date: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem("expenses") || "[]")
    localStorage.setItem("expenses", JSON.stringify([...existing, newExpense]))

    onSave()
    onClose()
  }

  <select
  className="w-full mb-2 p-2 border rounded"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Select Category</option>
  {categories.map((cat: string, i: number) => (
    <option key={i} value={cat}>{cat}</option>
  ))}
</select>


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>

        <input
          type="number"
          placeholder="Amount"
          className="w-full mb-2 p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full mb-2 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          className="w-full mb-4 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddExpenseModal