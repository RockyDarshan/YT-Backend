import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUser,
  setAuthToken,
} from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const u = await getCurrentUser();
        if (mounted) setUser(u);
      } catch (err) {
        // no user
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => (mounted = false);
  }, []);

  const login = async (credentials) => {
    const payload = await apiLogin(credentials);
    // payload may include user
    if (payload?.user) setUser(payload.user);
    return payload;
  };

  const register = async (formData) => {
    const res = await apiRegister(formData);
    return res;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
