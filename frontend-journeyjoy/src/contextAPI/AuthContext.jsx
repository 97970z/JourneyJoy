// frontend/src/contextAPI/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
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
			refreshToken();
		}
	};

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem("refreshToken");

		if (refreshToken) {
			try {
				const { data } = await Api.post("/auth/refresh", { refreshToken });
				setAuthTokens(data);
			} catch (error) {
				console.error("Error refreshing token", error);
				logout();
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

	const register = async (username, password, email) => {
		await Api.post("/auth/register", { username, password, email });
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
