// frontend/src/pages/AllPlaces.jsx
import React, { useState, useEffect } from "react";
import {
	GoogleMap,
	Marker,
	InfoWindow,
	useJsApiLoader,
} from "@react-google-maps/api";
import {
	Box,
	Drawer,
	List,
	ListItem,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Typography,
	CircularProgress,
} from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import { usePlaces } from "../contextAPI/PlacesContext";

const containerStyle = {
	width: "100%",
	height: "80vh",
};

const center = {
	lat: 37.5665,
	lng: 126.978,
};

function AllPlacesPage() {
	const { fetchExternalPlaces } = usePlaces();
	const [places, setPlaces] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [selectedSido, setSelectedSido] = useState("");
	const [sidos, setSidos] = useState([]);
	const [groupedPlaces, setGroupedPlaces] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
	});

	const groupPlacesByLocation = (items) => {
		const grouped = {};

		items.forEach((item) => {
			const key = `${item.lat}-${item.lng}`;
			if (!grouped[key]) {
				grouped[key] = {
					lat: parseFloat(item.lat),
					lng: parseFloat(item.lng),
					media: [],
				};
			}
			grouped[key].media.push({
				movieTitle: item.movieTitle,
				filmingLocation: item.filmingLocation,
				productionYear: item.productionYear,
			});
		});

		return Object.values(grouped);
	};

	useEffect(() => {
		const fetchData = async () => {
			const items = await fetchExternalPlaces();
			console.log(items);

			const uniqueSidos = [...new Set(items.map((item) => item.sido))].sort();
			setSidos(["All", ...uniqueSidos]);

			setPlaces(items);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (selectedSido !== "All") {
			const filteredBySido = places.filter(
				(place) => place.sido === selectedSido,
			);

			const grouped = groupPlacesByLocation(filteredBySido);
			setGroupedPlaces(grouped);
		} else {
			setGroupedPlaces(groupPlacesByLocation(places));
		}
	}, [selectedSido, places]);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setIsDrawerOpen(open);
	};

	if (!isLoaded) return <CircularProgress />;

	return (
		<Box sx={{ height: "100vh", width: "100%" }}>
			<Box
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					margin: "10px 0 10px 0",
				}}
			>
				<IconButton onClick={toggleDrawer(true)}>
					<TuneSharpIcon fontSize="large" />
					<Typography variant="h6">필터</Typography>
				</IconButton>
			</Box>
			<Drawer anchor={"left"} open={isDrawerOpen} onClose={toggleDrawer(false)}>
				<Box
					sx={{ width: 250 }}
					role="presentation"
					onClick={toggleDrawer(false)}
					onKeyDown={toggleDrawer(false)}
				>
					<List>
						<ListItem>
							<FormControl fullWidth>
								<InputLabel>Sido</InputLabel>
								<Select
									value={selectedSido}
									onChange={(e) => setSelectedSido(e.target.value)}
									label="Sido"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{sidos.map((sido) => (
										<MenuItem key={sido} value={sido}>
											{sido}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItem>
					</List>
				</Box>
			</Drawer>

			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
				{groupedPlaces.map((place, index) => (
					<Marker
						key={index}
						position={{ lat: place.lat, lng: place.lng }}
						onClick={() => setSelectedPlace(place)}
					/>
				))}

				{selectedPlace && (
					<InfoWindow
						position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
						onCloseClick={() => setSelectedPlace(null)}
					>
						<Box>
							{selectedPlace.media.map((media, index) => (
								<Box key={index} mb={2}>
									<Typography variant="h6">{media.movieTitle}</Typography>
									<Typography variant="body2">
										{media.filmingLocation}
									</Typography>
									<Typography variant="body2">
										{media.productionYear}
									</Typography>
								</Box>
							))}
						</Box>
					</InfoWindow>
				)}
			</GoogleMap>
		</Box>
	);
}

export default AllPlacesPage;
