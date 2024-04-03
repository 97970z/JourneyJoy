// frontend/src/components/AdminPanel/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Select,
	MenuItem,
} from "@mui/material";
import { useAuth } from "../../contextAPI/AuthContext";
import {
	fetchAllPlaces,
	updatePlaceStatus,
	fetchUsers,
	updateUserRole,
	deletePlace,
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
		const data = await fetchAllPlaces();
		setPlaces(data);
	};

	const handleUpdatePlaceStatus = async (id, status) => {
		await updatePlaceStatus(id, status);
		loadPlaces();
	};

	const handleDeletePlace = async (id) => {
		await deletePlace(id);
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

	const openEditForm = (id) => {
		console.log("Open edit form for", id);
	};

	return (
		<div>
			<h1>Admin Panel</h1>
			<h2>Places</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{places.map((place) => (
						<TableRow key={place._id}>
							<TableCell>{place.name}</TableCell>
							<TableCell>
								<Select
									value={place.status}
									onChange={(e) =>
										handleUpdatePlaceStatus(place._id, e.target.value)
									}
								>
									<MenuItem value="Pending">Pending</MenuItem>
									<MenuItem value="Approved">Approved</MenuItem>
									<MenuItem value="Rejected">Rejected</MenuItem>
								</Select>
							</TableCell>
							<TableCell>
								<Button onClick={() => openEditForm(place._id)} color="primary">
									Edit
								</Button>
								<Button
									onClick={() => handleDeletePlace(place._id)}
									color="secondary"
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<h2>Users</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Username</TableCell>
						<TableCell>Role</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user._id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>
								<Select
									value={user.role}
									onChange={(e) =>
										handleUpdateUserRole(user._id, e.target.value)
									}
								>
									<MenuItem value="user">User</MenuItem>
									<MenuItem value="admin">Admin</MenuItem>
								</Select>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default AdminPanel;
