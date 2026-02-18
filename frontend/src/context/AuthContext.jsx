import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setUser({ userId, token });
    }
    setLoading(false);
  }, []);

  function loginUser(userId, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setUser({ userId, token });
  }

  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
