export const getData = (key) => JSON.parse(localStorage.getItem(key) || "[]");
export const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const addItem = (key, item) => {
  const data = getData(key);
  data.unshift(item);
  saveData(key, data);
};

export const updateItem = (key, id, updated) => {
  const data = getData(key).map(i => i.id === id ? updated : i);
  saveData(key, data);
};

export const deleteItem = (key, id) => {
  const data = getData(key).filter(i => i.id !== id);
  saveData(key, data);
};

export const getTotals = () => {
  const income = getData("income").reduce((a,b)=>a+b.amount,0);
  const expenses = getData("expenses").reduce((a,b)=>a+b.amount,0);
  return { income, expenses, balance: income - expenses };
};

export const getCategories = () => {
  return [
    "Offering",
    "Tithes",
    "Mission",
    "Building Fund",
    "Special Gift"
  ]
}

