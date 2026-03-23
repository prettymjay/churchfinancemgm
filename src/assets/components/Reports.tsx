import { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function Reports() {
  const [income, setIncome] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIncome(await api.get("/income"));
    setExpenses(await api.get("/expenses"));
  };

  const totalIncome = income.reduce((a, b) => a + Number(b.amount), 0);
  const totalExpenses = expenses.reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div>
      <h2>Reports</h2>

      <div className="card">
        <p>Total Income: ₱{totalIncome}</p>
        <p>Total Expenses: ₱{totalExpenses}</p>
        <p>Balance: ₱{totalIncome - totalExpenses}</p>
      </div>
    </div>
  );
}