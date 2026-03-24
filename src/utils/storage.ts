import { v4 as uuid } from "uuid";
import type {
  BackupPayload,
  Category,
  Credentials,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from "../types";

const TRANSACTIONS_KEY = "church_finance_transactions";
const CATEGORIES_KEY = "church_finance_categories";
const CREDENTIALS_KEY = "church_finance_credentials";
const LAST_BACKUP_KEY = "church_finance_last_backup";
const BACKUP_VERSION = 1;

const today = new Date().toISOString().slice(0, 10);

const defaultCategories: Category[] = [
  { id: uuid(), name: "General Fund", type: "income", color: "#11408e" },
  { id: uuid(), name: "Church Building", type: "income", color: "#7a3200" },
  { id: uuid(), name: "Mission", type: "income", color: "#248232" },
  { id: uuid(), name: "Special Offering", type: "income", color: "#a97000" },
  { id: uuid(), name: "Utilities", type: "expense", color: "#11408e" },
  { id: uuid(), name: "Maintenance", type: "expense", color: "#b86200" },
  { id: uuid(), name: "Ministry", type: "expense", color: "#248232" },
  { id: uuid(), name: "Office", type: "expense", color: "#6c7280" },
];

const seededTransactions: Transaction[] = [
  {
    id: uuid(),
    type: "income",
    category: "General Fund",
    amount: 2450,
    date: "2026-03-20",
    description: "Sunday worship offerings",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: uuid(),
    type: "income",
    category: "Church Building",
    amount: 5000,
    date: "2026-03-17",
    description: "Building extension donation",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: uuid(),
    type: "income",
    category: "Mission",
    amount: 850,
    date: "2026-03-15",
    description: "Mission support pledge",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: uuid(),
    type: "expense",
    category: "Utilities",
    amount: 1200,
    date: "2026-03-18",
    description: "Electricity and water bill",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: uuid(),
    type: "expense",
    category: "Maintenance",
    amount: 840,
    date: "2026-03-12",
    description: "Roof and sound system repairs",
    createdAt: today,
    updatedAt: today,
  },
];

const defaultCredentials: Credentials = {
  username: "admin",
  password: "admin123",
};

const parse = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const bootstrapOfflineStore = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    write(CATEGORIES_KEY, defaultCategories);
  }

  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    write(TRANSACTIONS_KEY, seededTransactions);
  }

  if (!localStorage.getItem(CREDENTIALS_KEY)) {
    write(CREDENTIALS_KEY, defaultCredentials);
  }
};

export const getTransactions = (): Transaction[] => {
  bootstrapOfflineStore();
  return parse<Transaction[]>(TRANSACTIONS_KEY, []).sort((left, right) =>
    right.date.localeCompare(left.date),
  );
};

export const saveTransactions = (transactions: Transaction[]) => {
  write(TRANSACTIONS_KEY, transactions);
};

export const upsertTransaction = (
  type: TransactionType,
  values: TransactionFormValues,
  existingId?: string,
) => {
  const records = getTransactions();
  const timestamp = new Date().toISOString();

  if (existingId) {
    const updated = records.map((item) =>
      item.id === existingId
        ? {
            ...item,
            ...values,
            type,
            amount: Number(values.amount),
            updatedAt: timestamp,
          }
        : item,
    );
    saveTransactions(updated);
    return;
  }

  const nextRecord: Transaction = {
    id: uuid(),
    type,
    amount: Number(values.amount),
    category: values.category,
    date: values.date,
    description: values.description,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveTransactions([nextRecord, ...records]);
};

export const deleteTransaction = (id: string) => {
  saveTransactions(getTransactions().filter((item) => item.id !== id));
};

export const getCategories = (): Category[] => {
  bootstrapOfflineStore();
  return parse<Category[]>(CATEGORIES_KEY, []);
};

export const saveCategories = (categories: Category[]) => {
  write(CATEGORIES_KEY, categories);
};

export const addCategory = (name: string, type: TransactionType, color: string) => {
  const nextCategory: Category = {
    id: uuid(),
    name: name.trim(),
    type,
    color,
  };

  saveCategories([...getCategories(), nextCategory]);
};

export const deleteCategory = (id: string) => {
  saveCategories(getCategories().filter((category) => category.id !== id));
};

export const getCredentials = (): Credentials => {
  bootstrapOfflineStore();
  return parse<Credentials>(CREDENTIALS_KEY, defaultCredentials);
};

export const updateCredentials = (credentials: Credentials) => {
  write(CREDENTIALS_KEY, credentials);
};

export const getLastBackup = (): string | null => {
  return localStorage.getItem(LAST_BACKUP_KEY);
};

export const setLastBackup = (value: string) => {
  localStorage.setItem(LAST_BACKUP_KEY, value);
};

export const createBackupPayload = (): BackupPayload => ({
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  transactions: getTransactions(),
  categories: getCategories(),
  credentials: getCredentials(),
});

export const restoreBackupPayload = (payload: BackupPayload) => {
  if (
    !payload ||
    !Array.isArray(payload.transactions) ||
    !Array.isArray(payload.categories) ||
    !payload.credentials
  ) {
    throw new Error("Invalid backup file.");
  }

  saveTransactions(payload.transactions);
  saveCategories(payload.categories);
  updateCredentials(payload.credentials);
  setLastBackup(new Date().toISOString());
};

export const downloadTextFile = (
  filename: string,
  content: string,
  mimeType: string,
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
