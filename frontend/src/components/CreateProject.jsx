import { useState } from "react";
import { createProject } from "../api/api";

export default function CreateProject({ onCreated }) {
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createProject(projectId, name, description);
      setProjectId("");
      setName("");
      setDescription("");
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: "0.75rem", fontSize: "1rem", fontWeight: 600 }}>
        Create New Project
      </h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          style={{ marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: "0.75rem" }}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
