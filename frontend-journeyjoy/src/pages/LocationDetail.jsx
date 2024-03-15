// frontend/src/pages/LocationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Button,
	Container,
	TextField,
	Typography,
	CircularProgress,
	Box,
	Paper,
	Snackbar,
	Alert,
} from "@mui/material";
import { useAuth } from "../contextAPI/AuthContext";
import { usePlaces } from "../contextAPI/PlacesContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

const DetailContainer = styled(Container)({
	marginTop: "20px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "20px",
});

const Image = styled("img")({
	maxWidth: "100%",
	borderRadius: "5px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

const ActionButtons = styled(Box)({
	display: "flex",
	gap: "10px",
});

const LocationDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { places, updatePlace, deletePlace } = usePlaces();
	const [location, setLocation] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const foundLocation = places.find((place) => place._id === id);
		setLocation(foundLocation);
		if (foundLocation) {
			setFormData({
				name: foundLocation.name,
				description: foundLocation.description,
			});
		}
		setIsLoading(false);
	}, [id, places]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleDelete = async () => {
		try {
			await deletePlace(id);
			navigate("/");
		} catch (error) {
			console.error("Error deleting location:", error);
			setError("Failed to delete location. Please try again.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await updatePlace(id, formData);
			setIsEditing(false);
			setLocation({ ...location, ...formData });
			setError("");
		} catch (error) {
			console.error("Error updating location:", error);
			setError("Failed to update location. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <CircularProgress />;

	if (!location) return <Typography>Location not found.</Typography>;

	return (
		<DetailContainer>
			{isEditing ? (
				<>
					<TextField
						label="Name"
						name="name"
						fullWidth
						variant="outlined"
						value={formData.name}
						onChange={handleChange}
						margin="normal"
					/>
					<TextField
						label="Description"
						name="description"
						fullWidth
						variant="outlined"
						multiline
						rows={4}
						value={formData.description}
						onChange={handleChange}
						margin="normal"
					/>
				</>
			) : (
				<>
					<Typography variant="h4">{location.name}</Typography>
					<Paper
						elevation={3}
						sx={{ padding: "20px", maxWidth: 800, width: "100%" }}
					>
						<Typography variant="body1" paragraph>
							{location.description}
						</Typography>
					</Paper>
				</>
			)}
			<Image src={location.imageUrl} alt={location.name} />
			{currentUser?.username === location.addedBy && (
				<div>
					<Button
						startIcon={<EditIcon />}
						onClick={() => setIsEditing(!isEditing)}
						variant="contained"
						color="primary"
					>
						{isEditing ? "Cancel" : "Edit"}
					</Button>
					<Button
						startIcon={<DeleteIcon />}
						onClick={handleDelete}
						variant="contained"
						color="secondary"
					>
						Delete
					</Button>
					{isEditing && (
						<Button onClick={handleSubmit} variant="contained" color="success">
							Save Changes
						</Button>
					)}
				</div>
			)}
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError("")}
			>
				<Alert
					onClose={() => setError("")}
					severity="error"
					sx={{ width: "100%" }}
				>
					{error}
				</Alert>
			</Snackbar>
		</DetailContainer>
	);
};

export default LocationDetail;
