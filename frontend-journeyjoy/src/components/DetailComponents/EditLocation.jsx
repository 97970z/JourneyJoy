// frontend/src/components/DetailComponents/PlaceEditModal.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { usePlaces } from "../../contextAPI/PlacesContext";

const EditLocation = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { updatePlace, places } = usePlaces();
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		description: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const placeToEdit = places.find((place) => place._id === id);
		if (placeToEdit) {
			setFormData({
				name: placeToEdit.name,
				location: placeToEdit.location,
				description: placeToEdit.description,
			});
		}
	}, [id, places]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await updatePlace(id, formData);
		navigate(`/locations/${id}`);
		setIsLoading(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Typography variant="h4">Edit Location</Typography>
			<TextField
				label="Name"
				name="name"
				value={formData.name}
				onChange={handleChange}
			/>
			<Button type="submit" disabled={isLoading}>
				Save Changes
			</Button>
		</form>
	);
};

export default EditLocation;
