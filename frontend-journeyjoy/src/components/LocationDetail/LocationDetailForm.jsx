// frontend/src/components/LocationDetail/LocationDetailForm.jsx
import React from "react";
import { TextField } from "@mui/material";

const LocationDetailForm = ({ formData, handleChange }) => {
	return (
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
	);
};

export default LocationDetailForm;
