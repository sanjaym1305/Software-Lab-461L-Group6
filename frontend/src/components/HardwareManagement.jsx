import { useState } from "react";
import { checkoutHardware, checkinHardware } from "../api/api";

function HardwareCard({ hw, selectedProject, onUpdate }) {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const usedPercent = ((hw.capacity - hw.availability) / hw.capacity) * 100;
  const checkedOut = hw.capacity - hw.availability;

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

  const availabilityColor =
    hw.availability === 0
      ? "var(--color-danger)"
      : hw.availability < hw.capacity * 0.2
      ? "var(--color-warning)"
      : "var(--color-success)";

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-text)" }}>
          {hw.name}
        </h3>
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            padding: "0.375rem 0.875rem",
            borderRadius: "20px",
            background:
              hw.availability > 0
                ? "linear-gradient(135deg, var(--color-success-light) 0%, #d1fae5 100%)"
                : "linear-gradient(135deg, var(--color-danger-light) 0%, #fee2e2 100%)",
            color: hw.availability > 0 ? "var(--color-success-hover)" : "var(--color-danger-hover)",
            border: `1px solid ${hw.availability > 0 ? "var(--color-success)" : "var(--color-danger)"}`,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          {hw.availability > 0 ? "Available" : "Fully Allocated"}
        </span>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.9375rem",
            marginBottom: "0.75rem",
            fontWeight: 500,
          }}
        >
          <span style={{ color: "var(--color-text-secondary)" }}>
            Capacity: <strong style={{ color: "var(--color-text)" }}>{hw.capacity}</strong>
          </span>
          <span style={{ color: "var(--color-text-secondary)" }}>
            Available:{" "}
            <strong style={{ color: availabilityColor }}>{hw.availability}</strong>
          </span>
        </div>
        <div
          style={{
            height: "10px",
            borderRadius: "5px",
            background: "var(--color-border-light)",
            overflow: "hidden",
            marginBottom: "0.5rem",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${usedPercent}%`,
              borderRadius: "5px",
              background: `linear-gradient(90deg, ${availabilityColor} 0%, ${availabilityColor}dd 100%)`,
              transition: "width 0.4s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
            textAlign: "center",
          }}
        >
          {checkedOut} of {hw.capacity} units checked out ({usedPercent.toFixed(1)}%)
        </p>
      </div>

      {selectedProject && (
        <div
          style={{
            background: "var(--color-primary-light)",
            padding: "0.875rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.25rem",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-primary-dark)",
              fontWeight: 500,
            }}
          >
            <strong>{selectedProject.name}</strong> has{" "}
            <strong>{selectedProject.hwCheckouts?.[hw.name] || 0}</strong> units checked out
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 100px" }}>
          <input
            type="number"
            min="1"
            max={hw.availability}
            placeholder="Qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={{ textAlign: "center", fontWeight: 600 }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
          <button
            className="btn-primary btn-sm"
            disabled={loading || !selectedProject || hw.availability === 0}
            onClick={() => handleAction("checkout")}
            style={{ flex: 1 }}
          >
            Check Out
          </button>
          <button
            className="btn-success btn-sm"
            disabled={loading || !selectedProject}
            onClick={() => handleAction("checkin")}
            style={{ flex: 1 }}
          >
            Check In
          </button>
        </div>
      </div>

      {error && (
        <div className="error-msg" style={{ marginTop: "0.75rem", fontSize: "0.8125rem" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default function HardwareManagement({ hardware, selectedProject, onUpdate }) {
  if (!selectedProject) {
    return (
      <div className="card empty-state">
        <div className="empty-state-icon">⚙️</div>
        <p style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          Select a project
        </p>
        <p style={{ fontSize: "0.875rem" }}>
          Choose a project from above to manage hardware resources.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-2">
      {hardware.map((hw) => (
        <HardwareCard key={hw.name} hw={hw} selectedProject={selectedProject} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
