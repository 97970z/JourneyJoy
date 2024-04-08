// frontend/src/components/HomeComponents/AddLocationButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Snackbar,
	Alert,
} from "@mui/material";
import { usePlaces } from "../../contextAPI/PlacesContext";

const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

const AddLocationModal = ({ open, handleClose, username }) => {
	const navigate = useNavigate();
	const { addPlace } = usePlaces();
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		description: "",
		featuredIn: "",
		genre: "",
		image: null,
	});
	const [fileError, setFileError] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			setFileError("이미지 파일은 1.5MB 이하여야 합니다.");
			e.target.value = null;
		} else {
			setFormData({ ...formData, image: file });
			setFileError("");
		}
	};

	const validateForm = () => {
		for (const key in formData) {
			if (formData[key] === "" && key !== "image") {
				setSnackbarMessage("입력하지 않은 항목이 있습니다.");
				setOpenSnackbar(true);
				return false;
			}
		}
		if (!formData.image) {
			setSnackbarMessage("Please upload an image.");
			setOpenSnackbar(true);
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		const locationData = new FormData();
		Object.keys(formData).forEach((key) => {
			locationData.append(key, formData[key]);
		});
		locationData.append("addedBy", username);

		try {
			const submitID = await addPlace(locationData);
			handleClose();
			navigate(`/locations/${submitID}`);
			setFormData({
				name: "",
				location: "",
				description: "",
				featuredIn: "",
				genre: "",
				image: null,
			});
		} catch (error) {
			console.error("Failed to add location:", error);
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add a New Location</DialogTitle>
				<DialogContent>
					{fileError && <Alert severity="error">{fileError}</Alert>}
					<TextField
						autoFocus
						margin="dense"
						name="name"
						label="Name"
						type="text"
						fullWidth
						variant="outlined"
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="location"
						label="Location"
						type="text"
						fullWidth
						variant="outlined"
						value={formData.location}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="description"
						label="Description"
						fullWidth
						variant="outlined"
						multiline
						rows={4}
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="featuredIn"
						label="Featured In"
						fullWidth
						variant="outlined"
						value={formData.featuredIn}
						onChange={handleChange}
						required
					/>
					<FormControl fullWidth sx={{ mt: 2 }}>
						<InputLabel id="genre-select-label">Genre</InputLabel>
						<Select
							labelId="genre-select-label"
							id="genre"
							name="genre"
							value={formData.genre}
							label="Genre"
							onChange={handleChange}
							required
						>
							<MenuItem value="Movie">Movie</MenuItem>
							<MenuItem value="Drama">Drama</MenuItem>
							<MenuItem value="Anime">Anime</MenuItem>
							<MenuItem value="TV Show">TV Show</MenuItem>
						</Select>
					</FormControl>
					<Box mt={2}>
						<Button
							variant="contained"
							component="label"
							sx={{
								backgroundColor: "primary.main",
								color: "white",
								"&:hover": { backgroundColor: "primary.dark" },
							}}
						>
							Upload Image
							<input
								type="file"
								hidden
								accept="image/*"
								onChange={handleFileChange}
							/>
						</Button>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit}>Add Location</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity="warning"
					sx={{ width: "100%" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

export default AddLocationModal;
