// frontend/src/components/AdminPanel/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contextAPI/AuthContext";
import {
	fetchPendingPlaces,
	updatePlaceStatus,
	fetchUsers,
	updateUserRole,
} from "../../baseAPI/AdminPanelApi";

const AdminPanel = () => {
	const { currentUser } = useAuth();
	const [places, setPlaces] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (currentUser.role === "admin") {
			loadPlaces();
			loadUsers();
		}
	}, [currentUser]);

	const loadPlaces = async () => {
		const data = await fetchPendingPlaces();
		setPlaces(data);
	};

	const handleUpdatePlaceStatus = async (id, status) => {
		await updatePlaceStatus(id, status);
		loadPlaces();
	};

	const loadUsers = async () => {
		const data = await fetchUsers();
		setUsers(data);
	};

	const handleUpdateUserRole = async (id, role) => {
		await updateUserRole(id, role);
		loadUsers();
	};

	return (
		<div>
			<h1>Admin Panel</h1>
			<h2>Places</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{places.map((place) => (
						<tr key={place._id}>
							<td>{place.name}</td>
							<td>
								<select
									value={place.status}
									onChange={(e) =>
										handleUpdatePlaceStatus(place._id, e.target.value)
									}
								>
									<option value="Pending">Pending</option>
									<option value="Approved">Approved</option>
									<option value="Rejected">Rejected</option>
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<th>Username</th>
						<th>Role</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id}>
							<td>{user.username}</td>
							<td>
								<select
									value={user.role}
									onChange={(e) =>
										handleUpdateUserRole(user._id, e.target.value)
									}
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AdminPanel;
