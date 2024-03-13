// frontend/src/baseAPI/Api
import axios from "axios";

const Api = axios.create({
	baseURL: "http://localhost:5000/api",
});

// 모든 요청에 jwt 토큰을 헤더에 추가
Api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default Api;
