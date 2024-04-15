// // frontend/src/pages/LocationMap.jsx
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
	const [selectedSido, setSelectedSido] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [openAlert, setOpenAlert] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (apiPlaces.length === 0) {
				await fetchExternalPlaces();
			}
			const uniqueSidos = [
				...new Set(apiPlaces.map((item) => item.sido)),
			].sort();
			setSidos(["All", ...uniqueSidos]);
		};
		fetchData();
	}, [apiPlaces, fetchExternalPlaces]);

	const filteredPlaces = apiPlaces.filter((place) => {
		return selectedSido === "All" || place.sido === selectedSido;
	});

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsDrawerOpen(open);
	};

	const handleSearch = () => {
		if (selectedSido !== "All") {
			handleOpenAlert();
		}
	};

	const handleOpenAlert = () => {
		setOpenAlert(true);
	};

	const handleCloseAlert = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenAlert(false);
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
			<Snackbar
				open={openAlert}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
			>
				<Alert
					onClose={handleCloseAlert}
					severity="warning"
					sx={{ width: "100%" }}
				>
					필터에서 All을 선택하시고 검색해주세요!
				</Alert>
			</Snackbar>
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
