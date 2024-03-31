// src/baseAPI/AdminPanelApi.jsx
import Api from "./Api";

export const fetchPendingPlaces = async () => {
	try {
		const status = "Pending";
		const response = await Api.get(`/places/status/${status}`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch places", error);
		return [];
	}
};

export const updatePlaceStatus = async (id, status) => {
	try {
		const response = await Api.put(`/places/${id}/status`, { status });
		return response.data;
	} catch (error) {
		console.error("Failed to update place status", error);
		return null;
	}
};

export const fetchUsers = async () => {
	try {
		const response = await Api.get("/user");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch users", error);
		return [];
	}
};

export const updateUserRole = async (id, role) => {
	try {
		console.log("id", id);
		console.log("role", role);
		const response = await Api.put(`/user/${id}/role`, { role });
		return response.data;
	} catch (error) {
		console.error("Failed to update user role", error);
		return null;
	}
};
