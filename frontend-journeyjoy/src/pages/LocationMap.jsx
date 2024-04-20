// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import { Box, IconButton, Typography, TextField, Button } from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import { usePlaces } from "../contextAPI/PlacesContext";
import PlacesFilter from "../components/LocationMap/PlacesFilter";
import PlacesMap from "../components/LocationMap/PlacesMap";

function LocationMap() {
	const { apiPlaces, fetchExternalPlaces } = usePlaces();
	const [sidos, setSidos] = useState([]);
	const [selectedSido, setSelectedSido] = useState("None");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (apiPlaces.length === 0) {
				await fetchExternalPlaces();
			}
			const uniqueSidos = [
				...new Set(apiPlaces.map((item) => item.sido)),
			].sort();
			setSidos(["None", "All", ...uniqueSidos]);
		};
		fetchData();
	}, [apiPlaces, fetchExternalPlaces]);

	useEffect(() => {
		if (searchTerm) {
			applySearch();
		} else if (selectedSido !== "None") {
			applyFilter();
		} else {
			setFilteredPlaces([]);
		}
	}, [searchTerm, selectedSido, apiPlaces]);

	const applyFilter = () => {
		const results = apiPlaces.filter(
			(place) => selectedSido === "All" || place.sido === selectedSido,
		);
		setFilteredPlaces(results);
	};

	const applySearch = () => {
		const searchResults = apiPlaces.filter((place) =>
			place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredPlaces(searchResults);
	};

	const handleSearch = () => {
		applySearch();
	};

	const toggleDrawer = (open) => () => {
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
				<IconButton onClick={toggleDrawer(true)}>
					<TuneSharpIcon fontSize="large" />
					<Typography variant="h6">Filter</Typography>
				</IconButton>
				<Box style={{ display: "flex", alignItems: "center", width: "80%" }}>
					<TextField
						label="Search by Movie Title"
						variant="outlined"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{ flex: 1 }}
					/>
					<Button
						onClick={handleSearch}
						variant="contained"
						color="primary"
						style={{ marginLeft: "10px" }}
					>
						Search
					</Button>
				</Box>
			</Box>
			<PlacesFilter
				isOpen={isDrawerOpen}
				toggleDrawer={toggleDrawer}
				sidos={sidos}
				selectedSido={selectedSido}
				setSelectedSido={setSelectedSido}
			/>
			<PlacesMap places={filteredPlaces} />
		</Box>
	);
}

export default LocationMap;
