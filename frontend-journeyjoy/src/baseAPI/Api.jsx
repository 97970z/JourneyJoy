// frontend/src/baseAPI/Api
import axios from "axios";

const Api = axios.create({
	baseURL: "https://journeyjoy.o-r.kr/api",
});

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
