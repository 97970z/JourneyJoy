// frontend/src/components/LocationDetail/LocationActionButtons.jsx
import React from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const LocationActionButtons = ({
	isEditing,
	setIsEditing,
	handleDelete,
	handleSubmit,
}) => {
	return (
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
	);
};

export default LocationActionButtons;
