// frontend/src/contextAPI/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../baseAPI/Api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      try {
        const { data } = await api.get("/user/me");
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user", error);
        // 만약 토큰이 만료되서 사용자 정보를 못가져오면 refresh
        refreshToken();
      }
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token available");
      return;
    }

    try {
      const { data } = await api.post("/auth/refresh", { refreshToken });
      console.log("New access token:", data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
      fetchCurrentUser(); // 새 토큰으로 사용자 정보 다시 가져오기
    } catch (error) {
      console.error("Error refreshing token", error);
      logout(); // 재발급 실패하면 로그아웃
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("refreshToken", token.refreshToken);
    fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const value = { currentUser, login, logout, refreshToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
