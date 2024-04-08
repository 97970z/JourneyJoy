// frontend/src/pages/LocationDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useAuth } from "../contextAPI/AuthContext";
import { usePlaces } from "../contextAPI/PlacesContext";
import LocationDetailDisplay from "../components/LocationDetail/LocationDetailDisplay";
import LocationDetailForm from "../components/LocationDetail/LocationDetailForm";
import LocationActionButtons from "../components/LocationDetail/LocationActionButtons";
import { LocationDetailContainer, Image } from "./styles/LocationDetailStyles";

const LocationDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { userPlaces, updatePlace, deletePlace } = usePlaces();
	const [location, setLocation] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const foundLocation = userPlaces.find((place) => place._id === id);
		if (foundLocation) {
			setLocation(foundLocation);
			setFormData({
				name: foundLocation.name,
				description: foundLocation.description,
			});
		}
		setIsLoading(false);
	}, [id, userPlaces]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleDelete = async () => {
		try {
			await deletePlace(id);
			navigate("/");
		} catch (error) {
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
			setError("Failed to update location. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <CircularProgress />;
	if (!location)
		return <Typography>{error || "Loading location details..."}</Typography>;

	return (
		<LocationDetailContainer>
			{isEditing ? (
				<LocationDetailForm formData={formData} handleChange={handleChange} />
			) : (
				<LocationDetailDisplay {...location} />
			)}
			<Image src={location.imageUrl} alt={location.name} loading="lazy" />
			{currentUser?.username === location.addedBy && (
				<LocationActionButtons
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					handleDelete={handleDelete}
					handleSubmit={handleSubmit}
				/>
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
		</LocationDetailContainer>
	);
};

export default LocationDetail;
