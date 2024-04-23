// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import { Box, IconButton, Typography, TextField } from "@mui/material";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import HomeIcon from "@mui/icons-material/Home";
import { usePlaces } from "../contextAPI/PlacesContext";
import PlaceFilter from "../components/LocationMap/PlaceFilter";
import PlaceMap from "../components/LocationMap/PlaceMap";
import PlaceSearch from "../components/LocationMap/PlaceSearch";

const regionCoordinates = {
	서울특별시: { lat: 37.5665, lng: 126.978 },
	부산광역시: { lat: 35.1796, lng: 129.0756 },
	대구광역시: { lat: 35.8714, lng: 128.6014 },
	인천광역시: { lat: 37.4563, lng: 126.7052 },
	광주광역시: { lat: 35.1595, lng: 126.8526 },
	대전광역시: { lat: 36.3504, lng: 127.3845 },
	울산광역시: { lat: 35.5384, lng: 129.3114 },
	세종특별자치시: { lat: 36.4808, lng: 127.2892 },
	경기도: { lat: 37.4138, lng: 127.5183 },
	강원도: { lat: 37.8228, lng: 128.1555 },
	충청북도: { lat: 36.8, lng: 127.7 },
	충청남도: { lat: 36.5184, lng: 126.8 },
	전라북도: { lat: 35.7167, lng: 127.1536 },
	전라남도: { lat: 34.8679, lng: 126.991 },
	경상북도: { lat: 36.4919, lng: 128.8889 },
	경상남도: { lat: 35.4606, lng: 128.2132 },
	제주특별자치도: { lat: 33.4996, lng: 126.5312 },
	None: { lat: 37.5665, lng: 126.978 },
	All: { lat: 36.3504, lng: 127.3845 },
};

function LocationMap() {
	const { apiPlaces, fetchExternalPlaces } = usePlaces();
	const [sidos, setSidos] = useState([]);
	const [selectedSido, setSelectedSido] = useState("None");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [center, setCenter] = useState(regionCoordinates.None);

	useEffect(() => {
		initializePlaces();
		locateUser();
	}, [apiPlaces]);

	const initializePlaces = async () => {
		if (apiPlaces.length === 0) {
			await fetchExternalPlaces();
		}
		setSidos(["None", "All", ...new Set(apiPlaces.map((item) => item.sido))]);
	};

	const locateUser = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					setCenter(userLocation);
				},
				() => {
					console.error("위치 정보를 가져올 수 없습니다.");
				},
			);
		} else {
			console.error("위치 정보를 가져올 수 없습니다.");
		}
	};

	useEffect(() => {
		if (selectedSido && regionCoordinates[selectedSido]) {
			setCenter(regionCoordinates[selectedSido]);
		}
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
				<Box>
					<IconButton onClick={handleDrawerToggle(true)}>
						<TuneSharpIcon fontSize="large" />
						<Typography variant="h6">지역별 필터</Typography>
					</IconButton>{" "}
					/
					<IconButton onClick={locateUser} style={{ marginLeft: "10px" }}>
						<HomeIcon fontSize="large" />
						<Typography variant="h6">내 위치</Typography>
					</IconButton>
				</Box>
				<PlaceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			</Box>
			<PlaceFilter
				isOpen={isDrawerOpen}
				toggleDrawer={handleDrawerToggle}
				sidos={sidos}
				selectedSido={selectedSido}
				setSelectedSido={setSelectedSido}
			/>
			<PlaceMap places={filteredPlaces} center={center} />
		</Box>
	);
}

export default LocationMap;
