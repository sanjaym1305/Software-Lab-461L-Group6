export default function ProjectList({ projects, selectedProject, onSelect }) {
  if (projects.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
        No projects yet. Create or join one above.
      </div>
    );
  }

  return (
    <div>
      {projects.map((proj) => {
        const isSelected = selectedProject?.projectId === proj.projectId;
        return (
          <div
            key={proj.projectId}
            className="card"
            style={{
              cursor: "pointer",
              borderColor: isSelected ? "var(--color-primary)" : undefined,
              background: isSelected ? "var(--color-primary-light)" : undefined,
            }}
            onClick={() => onSelect(proj)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{proj.name}</strong>
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.85rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  ({proj.projectId})
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.82rem" }}>
                <span title="HWSet1 checked out">
                  HW1: <strong>{proj.hwCheckouts?.HWSet1 || 0}</strong>
                </span>
                <span title="HWSet2 checked out">
                  HW2: <strong>{proj.hwCheckouts?.HWSet2 || 0}</strong>
                </span>
              </div>
            </div>
            {proj.description && (
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.85rem",
                  marginTop: "0.35rem",
                }}
              >
                {proj.description}
              </p>
            )}
            <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", marginTop: "0.3rem" }}>
              Members: {proj.members?.join(", ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
