import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects, getHardware } from "../api/api";
import CreateProject from "./CreateProject";
import JoinProject from "./JoinProject";
import ProjectList from "./ProjectList";
import HardwareManagement from "./HardwareManagement";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [proj, hw] = await Promise.all([getProjects(), getHardware()]);
      setProjects(proj);
      setHardware(hw);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>HaaS Dashboard</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
            Manage your projects and hardware resources
          </p>
        </div>
        <div className="user-info">
          <span className="user-badge">{user.userId}</span>
          <button className="btn-outline" onClick={logoutUser}>
            Sign Out
          </button>
        </div>
      </header>

      {error && <div className="error-msg">{error}</div>}

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="section-title">Projects</h2>
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <CreateProject onCreated={refresh} />
          <JoinProject onJoined={refresh} />
        </div>
        <ProjectList
          projects={projects}
          selectedProject={selectedProject}
          onSelect={setSelectedProject}
        />
      </section>

      <section>
        <h2 className="section-title">Hardware Resources</h2>
        <HardwareManagement
          hardware={hardware}
          selectedProject={selectedProject}
          onUpdate={refresh}
        />
      </section>
    </div>
  );
}
