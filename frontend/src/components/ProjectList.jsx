export default function ProjectList({ projects, selectedProject, onSelect }) {
  if (projects.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-state-icon">📁</div>
        <p style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          No projects yet
        </p>
        <p style={{ fontSize: "0.875rem" }}>
          Create a new project or join an existing one to get started.
        </p>
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
              borderLeft: isSelected ? "4px solid var(--color-primary)" : "4px solid transparent",
              background: isSelected
                ? "linear-gradient(135deg, var(--color-primary-light) 0%, #ffffff 100%)"
                : undefined,
              transform: isSelected ? "scale(1.01)" : undefined,
            }}
            onClick={() => onSelect(proj)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <strong style={{ fontSize: "1.125rem", color: "var(--color-text)" }}>
                    {proj.name}
                  </strong>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    ({proj.projectId})
                  </span>
                </div>
                {proj.description && (
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {proj.description}
                  </p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  fontSize: "0.8125rem",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary-dark)",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                  title="HWSet1 checked out"
                >
                  HW1: {proj.hwCheckouts?.HWSet1 || 0}
                </span>
                <span
                  style={{
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary-dark)",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                  title="HWSet2 checked out"
                >
                  HW2: {proj.hwCheckouts?.HWSet2 || 0}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-secondary)",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--color-border-light)",
              }}
            >
              <span style={{ fontWeight: 500 }}>Members:</span>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {proj.members?.map((member, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "var(--color-border-light)",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
