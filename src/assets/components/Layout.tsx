import Sidebar from "./Sidebar";

export default function Layout({ children }: any) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f7fb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 30, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}