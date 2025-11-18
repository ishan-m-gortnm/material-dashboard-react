import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //  Auto-login on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      setLoading(false);
      return;
    }

    // Try to validate or refresh the session
    apiClient
      .post("/api/v1/admin/auth/refresh-token", { refreshToken })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUser({ token: res.data.token });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Hello error", error);
        // Tokens invalid → clear and force logout
        logout();
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/authentication/sign-in";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
