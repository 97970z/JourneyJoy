// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import { Box, IconButton, Typography, TextField } from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import { usePlaces } from "../contextAPI/PlacesContext";
import PlaceFilter from "../components/LocationMap/PlaceFilter";
import PlaceMap from "../components/LocationMap/PlaceMap";
import PlaceSearch from "../components/LocationMap/PlaceSearch";

function LocationMap() {
	const { apiPlaces, fetchExternalPlaces } = usePlaces();
	const [sidos, setSidos] = useState([]);
	const [selectedSido, setSelectedSido] = useState("None");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		initializePlaces();
	}, [apiPlaces]);

	const initializePlaces = async () => {
		if (apiPlaces.length === 0) {
			await fetchExternalPlaces();
		}
		setSidos(["None", "All", ...new Set(apiPlaces.map((item) => item.sido))]);
	};

	useEffect(() => {
		filterPlaces();
	}, [searchTerm, selectedSido, apiPlaces]);

	const filterPlaces = () => {
		if (searchTerm) {
			applySearch();
		} else if (selectedSido !== "None") {
			applyFilter();
		} else {
			setFilteredPlaces([]);
		}
	};

	const applyFilter = () => {
		const results = apiPlaces.filter(
			(place) =>
				(selectedSido === "All" ||
					place.sido === selectedSido ||
					selectedSido === "") &&
				(searchTerm === "" ||
					place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())),
		);
		setFilteredPlaces(results);
	};

	const applySearch = () => {
		const searchResults = apiPlaces.filter((place) =>
			place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredPlaces(searchResults);
	};

	const handleDrawerToggle = (open) => () => {
		setIsDrawerOpen(open);
	};

	return (
		<Box sx={{ height: "100vh", width: "100%" }}>
			<Box
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					margin: "10px 0 10px 0",
				}}
			>
				<IconButton onClick={handleDrawerToggle(true)}>
					<TuneSharpIcon fontSize="large" />
					<Typography variant="h6">Filter</Typography>
				</IconButton>
				<PlaceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			</Box>
			<PlaceFilter
				isOpen={isDrawerOpen}
				toggleDrawer={handleDrawerToggle}
				sidos={sidos}
				selectedSido={selectedSido}
				setSelectedSido={setSelectedSido}
			/>
			<PlaceMap places={filteredPlaces} />
		</Box>
	);
}

export default LocationMap;
