export type TransactionType = "income" | "expense";

export type PageName =
  | "Dashboard"
  | "Income"
  | "Expenses"
  | "Reports"
  | "Settings";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  transactions: Transaction[];
  categories: Category[];
  credentials: Credentials;
}

export interface TransactionFormValues {
  amount: number;
  category: string;
  date: string;
  description: string;
}
