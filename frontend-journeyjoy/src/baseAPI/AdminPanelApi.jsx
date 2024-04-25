// frontend/src/baseAPI/AdminPanelApi.jsx
import Api from "./Api";

export const fetchAllPlaces = async (page, limit) => {
	try {
		const response = await Api.get(`/admin/all?_page=${page}&_limit=${limit}`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch all places", error);
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

export const fetchUsers = async (page, limit) => {
	try {
		const response = await Api.get(`/user?_page=${page}&_limit=${limit}`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch users", error);
		return [];
	}
};

export const updateUserRole = async (id, role) => {
	try {
		const response = await Api.put(`/user/${id}/role`, { role });
		return response.data;
	} catch (error) {
		console.error("Failed to update user role", error);
		return null;
	}
};

export const editPlace = async (id, updatedData) => {
	try {
		const response = await Api.put(`/places/${id}`, updatedData);
		return response.data;
	} catch (error) {
		console.error("Failed to update place", error);
		return null;
	}
};

export const deletePlace = async (id) => {
	try {
		await Api.delete(`/places/${id}`);
		return true;
	} catch (error) {
		console.error("Failed to delete place", error);
		return false;
	}
};
