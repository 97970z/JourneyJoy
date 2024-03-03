// frontend/src/contextAPI/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../baseAPI/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // fetchCurrentUser를 useEffect 밖으로 이동
  const fetchCurrentUser = async () => {
    // 로컬스토리지에 "jwt" 키로 저장된 value를 가져옵니다.
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const { data } = await api.get("/user/me");
        setCurrentUser(data); // 사용자 정보를 상태에 저장
      } catch (error) {
        console.error("Error fetching user", error);
        localStorage.removeItem("jwt"); // 오류 발생 시 토큰 제거
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("jwt", token);
    fetchCurrentUser(); // 이제 fetchCurrentUser 함수를 여기서 호출할 수 있습니다.
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
