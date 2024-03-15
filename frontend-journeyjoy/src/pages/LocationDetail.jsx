// frontend/src/pages/LocationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Button,
	Container,
	Typography,
	CircularProgress,
	Box,
	Paper,
	IconButton,
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
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { deletePlace, places } = usePlaces();
	const [location, setLocation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const foundLocation = places.find((place) => place._id === id);
		setLocation(foundLocation);
		setIsLoading(false);
	}, [id, places]);

	const handleDelete = async () => {
		try {
			await deletePlace(id);
			navigate("/");
		} catch (error) {
			console.error("Error deleting location:", error);
		}
	};

	if (isLoading) return <CircularProgress />;

	if (!location) return <Typography>Location not found.</Typography>;

	return (
		<DetailContainer>
			<Typography variant="h3" gutterBottom>
				{location.name}
			</Typography>
			<Image src={location.imageUrl} alt={location.name} />
			<Paper
				elevation={3}
				sx={{ padding: "20px", maxWidth: 800, width: "100%" }}
			>
				<Typography variant="body1" paragraph>
					{location.description}
				</Typography>
			</Paper>
			{currentUser?.username === location.addedBy && (
				<ActionButtons>
					<Button
						component={Link}
						to={`/edit/${id}`}
						variant="contained"
						color="primary"
						startIcon={<EditIcon />}
					>
						Edit
					</Button>
					<IconButton color="error" onClick={handleDelete}>
						<DeleteIcon />
					</IconButton>
				</ActionButtons>
			)}
		</DetailContainer>
	);
};

export default LocationDetail;
