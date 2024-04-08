// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import { usePlaces } from "../contextAPI/PlacesContext";
import PlacesFilter from "../components/LocationMap/PlacesFilter";
import PlacesMap from "../components/LocationMap/PlacesMap";

function LocationMap() {
	const { apiPlaces, fetchExternalPlaces } = usePlaces();
	const [selectedSido, setSelectedSido] = useState("");
	const [sidos, setSidos] = useState([]);
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

	const filteredPlaces =
		selectedSido !== "All"
			? apiPlaces.filter((place) => place.sido === selectedSido)
			: apiPlaces;

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
