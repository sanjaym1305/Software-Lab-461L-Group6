const API_BASE = "/api";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function register(userId, password) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  });
}

export async function login(userId, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  });
}

export async function getProjects() {
  return request("/projects");
}

export async function createProject(projectId, name, description) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify({ projectId, name, description }),
  });
}

export async function joinProject(projectId) {
  return request(`/projects/${projectId}/join`, { method: "POST" });
}

export async function getProjectDetail(projectId) {
  return request(`/projects/${projectId}`);
}

export async function getHardware() {
  return request("/hardware");
}

export async function checkoutHardware(projectId, hwSet, quantity) {
  return request("/hardware/checkout", {
    method: "POST",
    body: JSON.stringify({ projectId, hwSet, quantity }),
  });
}

export async function checkinHardware(projectId, hwSet, quantity) {
  return request("/hardware/checkin", {
    method: "POST",
    body: JSON.stringify({ projectId, hwSet, quantity }),
  });
}
