import { useState } from "react";
import { joinProject } from "../api/api";

export default function JoinProject({ onJoined }) {
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await joinProject(projectId);
      setSuccess(`Joined project "${projectId}"`);
      setProjectId("");
      onJoined();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: "0.75rem", fontSize: "1rem", fontWeight: 600 }}>
        Join Existing Project
      </h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Project ID to join"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          style={{ marginBottom: "0.75rem" }}
        />
        <button type="submit" className="btn-outline" disabled={loading}>
          {loading ? "Joining..." : "Join Project"}
        </button>
        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "var(--color-success)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            {success}
          </p>
        )}
      </form>
    </div>
  );
}
