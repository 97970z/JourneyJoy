// frontend/src/contextAPI/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../baseAPI/Api";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			fetchCurrentUser(accessToken);
		}
	}, []);

	const fetchCurrentUser = async (accessToken) => {
		Api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
		try {
			const { data } = await Api.get("/user/me");
			setCurrentUser(data);
		} catch (error) {
			console.error("Error fetching user", error);
			// 만약 토큰이 만료되서 사용자 정보를 못가져오면 refresh
			refreshToken();
		}
	};

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem("refreshToken");

		if (refreshToken) {
			try {
				const { data } = await Api.post("/auth/refresh", { refreshToken });
				console.log("New access token:", data.accessToken);
				localStorage.setItem("accessToken", data.accessToken);
				fetchCurrentUser(data.accessToken);
			} catch (error) {
				console.error("Error refreshing token", error);
				logout(); // 재발급 실패하면 로그아웃
			}
		}
	};

	const setAuthTokens = (data) => {
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("refreshToken", data.refreshToken);
		fetchCurrentUser(data.accessToken);
	};

	const login = async (username, password) => {
		const { data } = await Api.post("/auth/login", { username, password });
		setAuthTokens(data);
	};

	const register = async (username, password) => {
		await Api.post("/auth/register", { username, password });
	};

	const logout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		setCurrentUser(null);
		delete Api.defaults.headers.common["Authorization"];
	};

	const value = { currentUser, login, register, logout, refreshToken };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
