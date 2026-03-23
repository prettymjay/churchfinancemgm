import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./assets/components/Layout";
import Dashboard from "./assets/components/Dashboard";
import Income from "./assets/components/Income";
import Expenses from "./assets/components/Expenses";
import Reports from "./assets/components/Reports";
import Settings from "./assets/components/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}