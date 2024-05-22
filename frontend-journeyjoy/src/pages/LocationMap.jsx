// frontend/src/pages/LocationMap.jsx
import { useState, useEffect } from "react";
import {
	Box,
	IconButton,
	Typography,
	AppBar,
	Toolbar,
	Accordion,
	AccordionSummary,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import { usePlaces } from "../contextAPI/PlacesContext";
import { useToggleManagement } from "../contextAPI/ToggleManagementContext";
import PlaceMap from "../components/LocationMap/PlaceMap";
import PlaceSearch from "../components/LocationMap/PlaceSearch";
import PlaceFilter_Region from "../components/LocationMap/PlaceFilter_Region";
import PlaceFilter_Festa from "../components/LocationMap/PlaceFilter_Festa";
import regionCoordinates from "../constants/RegionCoordinates";

function LocationMap() {
	const { isAccordionOpen, toggleAccordion } = useToggleManagement();
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
	const [selectedCodename, setSelectedCodename] = useState("None");
	const [filteredFestaPlaces, setFilteredFestaPlaces] = useState([]);

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
			"All",
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
	}, [searchTerm, selectedSido, selectedCodename, apiPlaces, festaPlaces]);

	const filterPlaces = () => {
		if (selectedSido !== "None") {
			setFilteredPlaces(
				apiPlaces.filter(
					(place) => selectedSido === "All" || place.sido === selectedSido,
				),
			);
		} else {
			setFilteredPlaces([]);
		}

		if (selectedCodename !== "None") {
			setFilteredFestaPlaces(
				festaPlaces.filter(
					(place) =>
						selectedCodename === "All" || place.CODENAME === selectedCodename,
				),
			);
		} else {
			setFilteredFestaPlaces([]);
		}

		if (searchTerm) applySearch();
		else if (selectedSido !== "None") applyFilter();
		else if (selectedCodename !== "None") applyFilter();
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
		setFilteredFestaPlaces(
			festaPlaces.filter(
				(place) =>
					(selectedCodename === "All" || place.CODENAME === selectedCodename) &&
					(searchTerm === "" ||
						place.TITLE.toLowerCase().includes(searchTerm.toLowerCase())),
			),
		);
	};

	const applySearch = () => {
		setFilteredPlaces(
			apiPlaces.filter((place) =>
				place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
		setFilteredFestaPlaces(
			festaPlaces.filter((place) =>
				place.TITLE.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	};

	const handleSelectSido = (sido) => {
		setSelectedSido(sido);
		setSelectedCodename("None");
		setFilteredFestaPlaces([]);
	};

	const handleSelectCodename = (codename) => {
		setSelectedCodename(codename);
		setFilteredFestaPlaces(
			festaPlaces.filter((place) => place.CODENAME === codename),
		);
		setSelectedSido("None");
		setFilteredPlaces([]);
	};

	return (
		<Box
			sx={{
				position: "relative",
				height: "100%",
				width: "100%",
				gap: 1,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<AppBar position="static" color="default" elevation={1} enableColorOnDark>
				<Accordion expanded={isAccordionOpen}>
					<Toolbar sx={{ justifyContent: "space-between", padding: 1 }}>
						<Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
							<AccordionSummary>
								<IconButton onClick={toggleAccordion} color="primary">
									<FilterListIcon />
									<Typography variant="subtitle1" sx={{ ml: 1 }}>
										필터
									</Typography>
								</IconButton>
							</AccordionSummary>
							<IconButton onClick={locateUser} color="primary">
								<HomeIcon />
								<Typography variant="subtitle1" sx={{ ml: 1 }}>
									내 위치
								</Typography>
							</IconButton>
						</Box>
						<PlaceSearch
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
					</Toolbar>
					<Typography
						variant="subtitle1"
						sx={{
							px: 2,
							display: "flex",
							justifyContent: "center",
						}}
					>
						지역 필터
					</Typography>
					<PlaceFilter_Region
						sidos={sidos}
						selectedSido={selectedSido}
						setSelectedSido={handleSelectSido}
					/>
					<hr />
					<Typography
						variant="subtitle1"
						sx={{ px: 2, display: "flex", justifyContent: "center" }}
					>
						서울 축제 필터
					</Typography>
					<PlaceFilter_Festa
						codenames={codenames}
						selectedCodename={selectedCodename}
						setSelectedCodename={handleSelectCodename}
					/>
				</Accordion>
			</AppBar>
			<PlaceMap
				places={[...filteredFestaPlaces, ...filteredPlaces]}
				center={center}
			/>
		</Box>
	);
}

export default LocationMap;
