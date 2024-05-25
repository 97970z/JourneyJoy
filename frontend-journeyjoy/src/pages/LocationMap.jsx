// frontend/src/pages/LocationMap.jsx
import { useEffect, useState, useCallback } from "react";
import {
	Box,
	IconButton,
	Typography,
	AppBar,
	Toolbar,
	Accordion,
	AccordionSummary,
	CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import { usePlaces } from "../contextAPI/PlacesContext";
import { useToggleManagement } from "../contextAPI/ToggleManagementContext";
import PlaceMap from "../components/LocationMap/PlaceMap";
import PlaceSearch from "../components/LocationMap/PlaceSearch";
import PlaceFilter_Region from "../components/LocationMap/PlaceFilter_Region";
import PlaceFilter_Type from "../components/LocationMap/PlaceFilter_Type";
import PlaceFilter_Festa from "../components/LocationMap/PlaceFilter_Festa";
import regionCoordinates from "../constants/RegionCoordinates";
import debounce from "lodash.debounce";

const fetchWithRetry = async (fetchFunc, retries = 3, delay = 1000) => {
	for (let i = 0; i < retries; i++) {
		try {
			await fetchFunc();
			return;
		} catch (error) {
			if (i < retries - 1) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				throw error;
			}
		}
	}
};

function LocationMap() {
	const { isAccordionOpen, toggleAccordion } = useToggleManagement();
	const {
		movieFilmPlaces,
		tvFilmPlaces,
		festaPlaces,
		fetchMovieFilmPlaces,
		fetchTvFilmPlaces,
		fetchFestaPlaces,
	} = usePlaces();
	const [searchTerm, setSearchTerm] = useState("");
	const [center, setCenter] = useState(regionCoordinates.None);
	const [loading, setLoading] = useState(false);

	const [sidos, setSidos] = useState([]);
	const [selectedSido, setSelectedSido] = useState("None");
	const [filteredPlaces, setFilteredPlaces] = useState([]);

	const [codenames, setCodenames] = useState([]);
	const [selectedCodename, setSelectedCodename] = useState("None");
	const [filteredFestaPlaces, setFilteredFestaPlaces] = useState([]);

	const [types, setTypes] = useState([]);
	const [selectedType, setSelectedType] = useState("None");
	const [filteredTvFilmPlaces, setFilteredTvFilmPlaces] = useState([]);

	useEffect(() => {
		setLoading(true);
		const initializePlaces = async () => {
			try {
				if (movieFilmPlaces.length === 0) fetchWithRetry(fetchMovieFilmPlaces);
				if (tvFilmPlaces.length === 0) fetchWithRetry(fetchTvFilmPlaces);
				if (festaPlaces.length === 0) fetchWithRetry(fetchFestaPlaces);
				setSidos([
					"None",
					"All",
					...new Set(movieFilmPlaces.map((place) => place.sido)),
				]);
				setCodenames([
					"None",
					"All",
					...new Set(festaPlaces.map((place) => place.CODENAME)),
				]);
				setTypes([
					"None",
					"All",
					...new Set(tvFilmPlaces.map((place) => place.MEDIA_TY)),
				]);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		};
		initializePlaces();
	}, [
		fetchMovieFilmPlaces,
		fetchTvFilmPlaces,
		fetchFestaPlaces,
		movieFilmPlaces,
		tvFilmPlaces,
		festaPlaces,
	]);

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

	const debouncedFilterPlaces = useCallback(
		debounce(() => {
			filterPlaces();
		}, 300),
		[
			selectedSido,
			selectedCodename,
			selectedType,
			searchTerm,
			movieFilmPlaces,
			tvFilmPlaces,
			festaPlaces,
		],
	);

	useEffect(() => {
		debouncedFilterPlaces();
		if (selectedSido && regionCoordinates[selectedSido]) {
			setCenter(regionCoordinates[selectedSido]);
		}
		return debouncedFilterPlaces.cancel;
	}, [
		searchTerm,
		selectedSido,
		selectedCodename,
		selectedType,
		movieFilmPlaces,
		tvFilmPlaces,
		festaPlaces,
		debouncedFilterPlaces,
	]);

	const filterPlaces = () => {
		if (selectedSido !== "None") {
			setFilteredPlaces(
				movieFilmPlaces.filter(
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

		if (selectedType !== "None") {
			setFilteredTvFilmPlaces(
				tvFilmPlaces.filter(
					(place) => selectedType === "All" || place.MEDIA_TY === selectedType,
				),
			);
		} else {
			setFilteredTvFilmPlaces([]);
		}

		if (searchTerm) applySearch();
		else if (selectedSido !== "None") applyFilter();
		else if (selectedCodename !== "None") applyFilter();
		else if (selectedType !== "None") applyFilter();
		else setFilteredPlaces([]);
	};

	const applyFilter = () => {
		setFilteredPlaces(
			movieFilmPlaces.filter(
				(place) =>
					(selectedSido === "All" || place.sido === selectedSido) &&
					(searchTerm === "" ||
						(typeof place.movieTitle === "string" &&
							place.movieTitle
								.toLowerCase()
								.includes(searchTerm.toLowerCase()))),
			),
		);
		setFilteredFestaPlaces(
			festaPlaces.filter(
				(place) =>
					(selectedCodename === "All" || place.CODENAME === selectedCodename) &&
					(searchTerm === "" ||
						(typeof place.TITLE === "string" &&
							place.TITLE.toLowerCase().includes(searchTerm.toLowerCase()))),
			),
		);
		setFilteredTvFilmPlaces(
			tvFilmPlaces.filter(
				(place) =>
					(selectedType === "All" || place.MEDIA_TY === selectedType) &&
					(searchTerm === "" ||
						(typeof place.TITLE_NM === "string" &&
							place.TITLE_NM.toLowerCase().includes(searchTerm.toLowerCase()))),
			),
		);
	};

	const applySearch = () => {
		setFilteredPlaces(
			movieFilmPlaces.filter(
				(place) =>
					typeof place.movieTitle === "string" &&
					place.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
		setFilteredFestaPlaces(
			festaPlaces.filter(
				(place) =>
					typeof place.TITLE === "string" &&
					place.TITLE.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
		setFilteredTvFilmPlaces(
			tvFilmPlaces.filter(
				(place) =>
					typeof place.TITLE_NM === "string" &&
					place.TITLE_NM.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	};

	const handleSelectSido = (sido) => {
		setSelectedSido(sido);
		resetFilters("sido");
	};

	const handleSelectCodename = (codename) => {
		setSelectedCodename(codename);
		resetFilters("codename");
	};

	const handleSelectType = (type) => {
		setSelectedType(type);
		resetFilters("type");
	};

	const resetFilters = (filterType) => {
		setFilteredPlaces([]);
		setFilteredFestaPlaces([]);
		setFilteredTvFilmPlaces([]);

		if (filterType !== "sido") setSelectedSido("None");
		if (filterType !== "codename") setSelectedCodename("None");
		if (filterType !== "type") setSelectedType("None");
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

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
						전국 영화 촬영지 필터
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
					<hr />
					<Typography
						variant="subtitle1"
						sx={{ px: 2, display: "flex", justifyContent: "center" }}
					>
						TV 촬영지 필터
					</Typography>
					<PlaceFilter_Type
						types={types}
						selectedType={selectedType}
						setSelectedType={handleSelectType}
					/>
				</Accordion>
			</AppBar>
			<PlaceMap
				places={[
					...filteredFestaPlaces,
					...filteredPlaces,
					...filteredTvFilmPlaces,
				]}
				center={center}
			/>
		</Box>
	);
}

export default LocationMap;
