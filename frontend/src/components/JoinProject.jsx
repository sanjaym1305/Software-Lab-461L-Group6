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
      setSuccess(`Successfully joined project "${projectId}"`);
      setProjectId("");
      setTimeout(() => {
        setSuccess("");
        onJoined();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Join Existing Project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="joinProjectId">Project ID</label>
          <input
            id="joinProjectId"
            type="text"
            placeholder="Enter project ID to join"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-outline" disabled={loading}>
          {loading ? "Joining..." : "Join Project"}
        </button>
        {error && <div className="error-msg" style={{ marginTop: "0.75rem" }}>{error}</div>}
        {success && <div className="success-msg" style={{ marginTop: "0.75rem" }}>{success}</div>}
      </form>
    </div>
  );
}
