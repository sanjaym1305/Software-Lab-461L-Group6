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
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectId">Project ID</label>
          <input
            id="projectId"
            type="text"
            placeholder="Enter unique project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            id="projectName"
            type="text"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectDesc">Description (optional)</label>
          <input
            id="projectDesc"
            type="text"
            placeholder="Brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
        {error && <div className="error-msg" style={{ marginTop: "0.75rem" }}>{error}</div>}
      </form>
    </div>
  );
}
