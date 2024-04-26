// frontend/src/components/LocationDetail/LocationActionButtons.jsx
import { Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

const LocationActionButtons = ({
	isEditing,
	setIsEditing,
	handleDelete,
	handleSubmit,
}) => {
	return (
		<Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
			{isEditing ? (
				<>
					<Button
						startIcon={<SaveIcon />}
						onClick={handleSubmit}
						variant="contained"
						color="success"
					>
						Save Changes
					</Button>
					<Button
						startIcon={<DeleteIcon />}
						onClick={handleDelete}
						variant="outlined"
						color="error"
					>
						Delete
					</Button>
				</>
			) : (
				<Button
					startIcon={<EditIcon />}
					onClick={() => setIsEditing(true)}
					variant="contained"
					color="primary"
				>
					Edit
				</Button>
			)}
		</Stack>
	);
};

export default LocationActionButtons;
