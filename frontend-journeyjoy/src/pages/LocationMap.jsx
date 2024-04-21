// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import {
	Box,
	IconButton,
	Typography,
	TextField,
	Button,
	Snackbar,
	Alert,
} from "@mui/material";
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
	const [alertInfo, setAlertInfo] = useState({ open: false, message: "" });

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

	const handleSearchClick = () => {
		if (!searchTerm.trim()) {
			showAlert("검색어를 입력해주세요.");
			return;
		}
		filterPlaces();
	};

	const showAlert = (message) => {
		setAlertInfo({ open: true, message });
	};

	const handleCloseAlert = () => {
		setAlertInfo({ ...alertInfo, open: false });
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
				<Box style={{ display: "flex", alignItems: "center", width: "80%" }}>
					<TextField
						label="Search by Movie Title"
						variant="outlined"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{ flex: 1 }}
					/>
					<Button
						onClick={handleSearchClick}
						variant="contained"
						color="primary"
						style={{ marginLeft: "10px" }}
					>
						Search
					</Button>
				</Box>
			</Box>
			<Snackbar
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
			>
				<Alert
					onClose={handleCloseAlert}
					severity="info"
					sx={{ width: "100%" }}
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
			<PlacesFilter
				isOpen={isDrawerOpen}
				toggleDrawer={handleDrawerToggle}
				sidos={sidos}
				selectedSido={selectedSido}
				setSelectedSido={setSelectedSido}
			/>
			<PlacesMap places={filteredPlaces} />
		</Box>
	);
}

export default LocationMap;
