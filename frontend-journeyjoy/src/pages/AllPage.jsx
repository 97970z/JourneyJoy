// frontend/src/pages/AllPage.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
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
} from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import { usePlaces } from "../contextAPI/PlacesContext";

const customIcon = new L.Icon({
	iconUrl:
		"https://res.cloudinary.com/dl6f9clxo/image/upload/v1711023540/journeyjoy/rc5rmev7gsotxieckjp9.svg",
	iconSize: [30, 30],
	iconAnchor: [17, 30],
	popupAnchor: [0, -30],
});

function AllPlacesPage() {
	const { fetchExternalPlaces } = usePlaces();
	const [places, setPlaces] = useState([]);
	const [selectedSido, setSelectedSido] = useState("");
	const [sidos, setSidos] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const items = await fetchExternalPlaces();

			const uniqueSidos = [...new Set(items.map((item) => item.sido))].sort();
			setSidos(["All", ...uniqueSidos]);

			setPlaces(items);
		};

		fetchData();
	}, []);

	const filteredPlaces =
		selectedSido !== "All"
			? places.filter((place) => place.sido === selectedSido)
			: places;

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setIsDrawerOpen(open);
	};

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
					<Typography variant="h6">Filter</Typography>
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
			<MapContainer
				className="markercluster-map"
				center={[37.5665, 126.978]}
				zoom={7}
				style={{ height: "70vh", width: "100%" }}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<MarkerClusterGroup chunkedLoading>
					{filteredPlaces.map((place, index) => (
						<Marker
							key={index}
							position={[place.lat, place.lng]}
							icon={customIcon}
						>
							<Popup>
								{place.movieTitle}
								<br />
								{place.filmingLocation}
								<br />
								{place.productionYear}
							</Popup>
						</Marker>
					))}
				</MarkerClusterGroup>
			</MapContainer>
		</Box>
	);
}

export default AllPlacesPage;
