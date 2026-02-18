import { useState } from "react";
import { checkoutHardware, checkinHardware } from "../api/api";

function HardwareCard({ hw, selectedProject, onUpdate }) {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const usedPercent = ((hw.capacity - hw.availability) / hw.capacity) * 100;

  async function handleAction(action) {
    setError("");
    const quantity = parseInt(qty, 10);
    if (!quantity || quantity <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    if (!selectedProject) {
      setError("Select a project first");
      return;
    }
    setLoading(true);
    try {
      if (action === "checkout") {
        await checkoutHardware(selectedProject.projectId, hw.name, quantity);
      } else {
        await checkinHardware(selectedProject.projectId, hw.name, quantity);
      }
      setQty("");
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>{hw.name}</h3>
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            padding: "0.25rem 0.65rem",
            borderRadius: "12px",
            background: hw.availability > 0 ? "var(--color-primary-light)" : "#fde8e8",
            color: hw.availability > 0 ? "var(--color-primary)" : "var(--color-danger)",
          }}
        >
          {hw.availability > 0 ? "Available" : "Fully Allocated"}
        </span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            marginBottom: "0.35rem",
          }}
        >
          <span>Capacity: <strong>{hw.capacity}</strong></span>
          <span>Available: <strong>{hw.availability}</strong></span>
        </div>
        <div
          style={{
            height: "8px",
            borderRadius: "4px",
            background: "#e9ecef",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${usedPercent}%`,
              borderRadius: "4px",
              background:
                usedPercent > 80
                  ? "var(--color-danger)"
                  : usedPercent > 50
                  ? "#f39c12"
                  : "var(--color-primary)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", marginTop: "0.3rem" }}>
          {hw.capacity - hw.availability} of {hw.capacity} units checked out
        </p>
      </div>

      {selectedProject && (
        <p style={{ fontSize: "0.82rem", marginBottom: "0.5rem", color: "var(--color-text-secondary)" }}>
          Project <strong>{selectedProject.name}</strong> has{" "}
          <strong>{selectedProject.hwCheckouts?.[hw.name] || 0}</strong> units checked out
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: "100px", flexShrink: 0 }}
        />
        <button
          className="btn-primary"
          disabled={loading || !selectedProject}
          onClick={() => handleAction("checkout")}
          style={{ fontSize: "0.85rem", padding: "0.6rem 1rem" }}
        >
          Check Out
        </button>
        <button
          className="btn-success"
          disabled={loading || !selectedProject}
          onClick={() => handleAction("checkin")}
          style={{ fontSize: "0.85rem", padding: "0.6rem 1rem" }}
        >
          Check In
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function HardwareManagement({ hardware, selectedProject, onUpdate }) {
  if (!selectedProject) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
        Select a project above to manage hardware resources.
      </div>
    );
  }

  return (
    <div className="grid-2">
      {hardware.map((hw) => (
        <HardwareCard
          key={hw.name}
          hw={hw}
          selectedProject={selectedProject}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
