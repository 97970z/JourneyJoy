// frontend/src/pages/LocationDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	CircularProgress,
	Snackbar,
	Alert,
	Dialog,
} from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../contextAPI/AuthContext";
import { usePlaces } from "../contextAPI/PlacesContext";
import LocationDetailDisplay from "../components/LocationDetail/LocationDetailDisplay";
import LocationDetailForm from "../components/LocationDetail/LocationDetailForm";
import LocationActionButtons from "../components/LocationDetail/LocationActionButtons";
import {
	DetailPaper,
	ImageBanner,
	ActionContainer,
} from "./styles/LocationDetailStyles";

const containerStyle = {
	width: "100%",
	height: "400px",
};

const LocationDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { userPlaces, updatePlace, deletePlace, getCoordinatesFromAddress } =
		usePlaces();
	const [location, setLocation] = useState(null);
	const [coords, setCoords] = useState({ lat: 33.450701, lng: 126.570667 });
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		featuredIn: "",
		genre: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [imageOpen, setImageOpen] = useState(false);
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
		language: "ko",
	});

	useEffect(() => {
		const foundLocation = userPlaces.find((place) => place._id === id);
		if (foundLocation) {
			setLocation(foundLocation);
			setFormData({
				name: foundLocation.name,
				description: foundLocation.description,
				address: foundLocation.location,
				featuredIn: foundLocation.featuredIn,
				genre: foundLocation.genre,
			});
			fetchCoordinates(foundLocation.location);
		}
		setIsLoading(false);
	}, [id, userPlaces]);

	const fetchCoordinates = async (address) => {
		const { lat, lng } = await getCoordinatesFromAddress(address);
		setCoords({ lat, lng });
	};

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
			fetchCoordinates(formData.address);
		} catch (error) {
			setError("Failed to update location. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <CircularProgress />;
	if (!location)
		return <Typography>{error || "Loading location details..."}</Typography>;

	return isLoaded ? (
		<DetailPaper>
			<ImageBanner
				src={location.imageUrl}
				alt={location.name}
				loading="lazy"
				onClick={() => setImageOpen(true)}
			/>
			<Dialog open={imageOpen} onClose={() => setImageOpen(false)}>
				<img
					src={location.imageUrl}
					alt={location.name}
					style={{ width: "100%" }}
				/>
			</Dialog>
			{isEditing ? (
				<LocationDetailForm formData={formData} handleChange={handleChange} />
			) : (
				<LocationDetailDisplay {...location} />
			)}
			<Box sx={{ width: "100%", height: "400px", mt: 2 }}>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={coords}
					zoom={15}
					options={{ gestureHandling: "none", disableDefaultUI: true }}
				></GoogleMap>
			</Box>
			{currentUser?.username === location.addedBy && (
				<ActionContainer>
					<LocationActionButtons
						isEditing={isEditing}
						setIsEditing={setIsEditing}
						handleDelete={handleDelete}
						handleSubmit={handleSubmit}
					/>
				</ActionContainer>
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
		</DetailPaper>
	) : (
		<Typography>Loading map...</Typography>
	);
};

export default LocationDetail;
