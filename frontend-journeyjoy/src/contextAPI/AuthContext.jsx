// frontend/src/contextAPI/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../baseAPI/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const { data } = await api.get("/user/me");
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user", error);
        localStorage.removeItem("jwt");
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("jwt", token);
    fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
