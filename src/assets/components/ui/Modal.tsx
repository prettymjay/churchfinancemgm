import React from "react";

export default function Modal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        {children}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  width: 400,
  position: "relative" as const,
};

const closeBtn = {
  position: "absolute" as const,
  right: 10,
  top: 10,
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};