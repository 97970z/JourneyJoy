// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Select,
	MenuItem,
	Pagination,
} from "@mui/material";
import { useAuth } from "../contextAPI/AuthContext";
import {
	fetchAllPlaces,
	updatePlaceStatus,
	fetchUsers,
	updateUserRole,
	deletePlace,
} from "../baseAPI/AdminPanelApi";

const AdminPanel = () => {
	const { currentUser } = useAuth();
	const [places, setPlaces] = useState([]);
	const [users, setUsers] = useState([]);
	const [currentPagePlaces, setCurrentPagePlaces] = useState(1);
	const [currentPageUsers, setCurrentPageUsers] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		if (currentUser.role === "admin") {
			loadPlaces();
		}
	}, [currentUser, currentPagePlaces]);

	useEffect(() => {
		if (currentUser.role === "admin") {
			loadUsers();
		}
	}, [currentUser, currentPageUsers]);

	const loadPlaces = async () => {
		const response = await fetchAllPlaces(currentPagePlaces, itemsPerPage);
		setPlaces(response.data);
	};

	const loadUsers = async () => {
		const response = await fetchUsers(currentPageUsers, itemsPerPage);
		setUsers(response.data);
	};

	const handleUpdatePlaceStatus = async (id, status) => {
		await updatePlaceStatus(id, status);
		loadPlaces();
	};

	const handleDeletePlace = async (id) => {
		await deletePlace(id);
		loadPlaces();
	};

	const handleUpdateUserRole = async (id, role) => {
		await updateUserRole(id, role);
		loadUsers();
	};

	const openEditForm = (id) => {};

	const handlePageChangePlaces = (event, value) => {
		setCurrentPagePlaces(value);
	};

	const handlePageChangeUsers = (event, value) => {
		setCurrentPageUsers(value);
	};

	const totalPlacesPages = Math.ceil(places.length / itemsPerPage);
	const totalUsersPages = Math.ceil(users.length / itemsPerPage);

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
			<Pagination
				count={totalPlacesPages}
				page={currentPagePlaces}
				onChange={handlePageChangePlaces}
				color="primary"
			/>
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
			<Pagination
				count={totalUsersPages}
				page={currentPageUsers}
				onChange={handlePageChangeUsers}
				color="secondary"
			/>
		</div>
	);
};

export default AdminPanel;
