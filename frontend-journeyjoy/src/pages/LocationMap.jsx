// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import {
	Box,
	IconButton,
	Typography,
	Chip,
	AppBar,
	Toolbar,
	Paper,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import { usePlaces } from "../contextAPI/PlacesContext";
import PlaceFilter from "../components/LocationMap/PlaceFilter";
import PlaceMap from "../components/LocationMap/PlaceMap";
import PlaceSearch from "../components/LocationMap/PlaceSearch";
import regionCoordinates from "../constants/RegionCoordinates";

function LocationMap() {
	const {
		apiPlaces,
		festaPlaces,
		fetchExternalPlaces,
		fetchExternalPlaces_Festa,
	} = usePlaces();
	const [sidos, setSidos] = useState([]);
	const [selectedSido, setSelectedSido] = useState("None");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [center, setCenter] = useState(regionCoordinates.None);
	const [codenames, setCodenames] = useState([]);
	const [selectedCodename, setSelectedCodename] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		initializePlaces();
		locateUser();
	}, [apiPlaces, festaPlaces]);

	const initializePlaces = async () => {
		if (apiPlaces.length === 0) await fetchExternalPlaces();
		if (festaPlaces.length === 0) await fetchExternalPlaces_Festa();
		setSidos(["None", "All", ...new Set(apiPlaces.map((item) => item.sido))]);
		setCodenames([
			"None",
			...new Set(festaPlaces.map((place) => place.CODENAME)),
		]);
	};

	const locateUser = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) =>
					setCenter({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					}),
				() => console.error("Failed to retrieve location."),
			);
		}
	};

	useEffect(() => {
		if (selectedSido && regionCoordinates[selectedSido]) {
			setCenter(regionCoordinates[selectedSido]);
		}
		filterPlaces();
	}, [searchTerm, selectedSido, apiPlaces]);

	const filterPlaces = () => {
		if (searchTerm) applySearch();
		else if (selectedSido !== "None") applyFilter();
		else setFilteredPlaces([]);
	};

	const applyFilter = () => {
		setFilteredPlaces(
			apiPlaces.filter(
				(place) =>
					(selectedSido === "All" || place.sido === selectedSido) &&
					(searchTerm === "" ||
						place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())),
			),
		);
	};

	const applySearch = () => {
		setFilteredPlaces(
			apiPlaces.filter((place) =>
				place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	};

	const handleDrawerToggle = (open) => () => setIsDrawerOpen(open);

	return (
		<Box sx={{ height: "100vh", width: "100%" }}>
			<AppBar position="static" color="default" elevation={1}>
				<Toolbar sx={{ justifyContent: "space-between", padding: 1 }}>
					<Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
						<IconButton onClick={handleDrawerToggle(true)} color="primary">
							<FilterListIcon />
							<Typography variant="subtitle1" sx={{ ml: 1 }}>
								필터
							</Typography>
						</IconButton>
						<IconButton onClick={locateUser} color="primary">
							<HomeIcon />
							<Typography variant="subtitle1" sx={{ ml: 1 }}>
								내 위치
							</Typography>
						</IconButton>
					</Box>
					<PlaceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</Toolbar>
				<Paper
					sx={{
						px: 2,
						py: 1,
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
						gap: 1,
					}}
				>
					{codenames.map((codename) => (
						<Chip
							key={codename}
							label={codename}
							onClick={() => setSelectedCodename(codename)}
							variant={selectedCodename === codename ? "filled" : "outlined"}
							color={selectedCodename === codename ? "success" : "primary"}
						/>
					))}
				</Paper>
			</AppBar>
			<Box sx={{ flex: 1, overflow: "auto" }}>
				<PlaceMap places={filteredPlaces} center={center} />
			</Box>
			<PlaceFilter
				isOpen={isDrawerOpen}
				toggleDrawer={handleDrawerToggle}
				sidos={sidos}
				selectedSido={selectedSido}
				setSelectedSido={setSelectedSido}
			/>
		</Box>
	);
}

export default LocationMap;
