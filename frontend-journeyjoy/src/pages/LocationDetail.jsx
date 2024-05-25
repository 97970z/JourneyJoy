// frontend/src/pages/LocationDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Dialog } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../contextAPI/AuthContext";
import { usePlaces } from "../contextAPI/PlacesContext";
import { useToggleManagement } from "../contextAPI/ToggleManagementContext";
import LocationDetailDisplay from "../components/LocationDetail/LocationDetailDisplay";
import LocationDetailForm from "../components/LocationDetail/LocationDetailForm";
import LocationActionButtons from "../components/LocationDetail/LocationActionButtons";
import {
	DetailPaper,
	ImageBanner,
	ActionContainer,
} from "./styles/LocationDetailStyles";

const LocationDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { userPlaces, updatePlace, deletePlace, getCoordinatesFromAddress } =
		usePlaces();
	const { isImageOpen, toggleImage, isEditing, toggleEditing, showAlert } =
		useToggleManagement();
	const [location, setLocation] = useState(null);
	const [coords, setCoords] = useState({ lat: 33.450701, lng: 126.570667 });
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		description: "",
		featuredIn: "",
		genre: "",
	});
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
				location: foundLocation.location,
				description: foundLocation.description,
				featuredIn: foundLocation.featuredIn,
				genre: foundLocation.genre,
			});
			fetchCoordinates(foundLocation.location);
		}
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
			showAlert("error", "삭제에 실패했습니다. 다시 시도해 주세요.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updatePlace(id, formData);
			toggleEditing();
			setLocation({ ...location, ...formData });
			fetchCoordinates(formData.location);
		} catch (error) {
			showAlert("error", "업데이트에 실패했습니다. 다시 시도해 주세요.");
		}
	};

	if (!location)
		return isLoaded ? (
			<CircularProgress />
		) : (
			<Typography>데이터 로딩중...</Typography>
		);

	return (
		isLoaded && (
			<DetailPaper>
				<ImageBanner
					src={location.imageUrl}
					alt={location.name}
					loading="lazy"
					onClick={toggleImage}
				/>
				<Dialog open={isImageOpen} onClose={toggleImage}>
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
						mapContainerStyle={{ width: "100%", height: "400px" }}
						center={coords}
						zoom={15}
						options={{
							gestureHandling: "none",
							disableDefaultUI: true,
							zoomControl: true,
						}}
					></GoogleMap>
				</Box>
				{currentUser?.username === location.addedBy && (
					<ActionContainer>
						<LocationActionButtons
							isEditing={isEditing}
							setIsEditing={toggleEditing}
							handleDelete={handleDelete}
							handleSubmit={handleSubmit}
						/>
					</ActionContainer>
				)}
			</DetailPaper>
		)
	);
};

export default LocationDetail;
