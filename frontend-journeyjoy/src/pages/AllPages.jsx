// frontend/src/pages/AllPlaces.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { xml2js } from "xml-js";
import {
	GoogleMap,
	Marker,
	InfoWindow,
	useJsApiLoader,
} from "@react-google-maps/api";
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Paper,
	Typography,
	CircularProgress,
} from "@mui/material";

const containerStyle = {
	width: "100%",
	height: "70vh",
};

const center = {
	lat: 37.5665,
	lng: 126.978,
};

const filterPanelStyle = {
	padding: "20px",
	marginBottom: "20px",
	display: "flex",
	justifyContent: "space-between",
	flexWrap: "wrap",
	background: "#f5f5f5",
};

function AllPlacesPage() {
	const [places, setPlaces] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [selectedSido, setSelectedSido] = useState("");
	const [selectedMovieTitle, setSelectedMovieTitle] = useState("");
	const [selectedProductionYear, setSelectedProductionYear] = useState("");
	const [sidos, setSidos] = useState([]);
	const [movieTitles, setMovieTitles] = useState([]);
	const [productionYears, setProductionYears] = useState([]);
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
	});

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				"https://apis.data.go.kr/B551010/locfilming/locfilmingList",
				{
					params: {
						serviceKey: decodeURIComponent(
							import.meta.env.VITE_OPEN_API_SERVICE_KEY,
						),
						pageNo: 1,
						numOfRows: 1000,
					},
				},
			);
			const result = xml2js(response.data, { compact: true, spaces: 4 });
			const items = result.response.item;

			const uniqueSidos = [
				...new Set(items.map((item) => item.sido._text)),
			].sort((a, b) => a.localeCompare(b));

			const uniqueMovieTitles = [
				...new Set(items.map((item) => item.movieTitle._text)),
			].sort((a, b) => a.localeCompare(b));

			const uniqueProductionYears = [
				...new Set(items.map((item) => item.productionYear._text)),
			].sort((a, b) => a.localeCompare(b));

			setSidos(uniqueSidos);
			setMovieTitles(uniqueMovieTitles);
			setProductionYears(uniqueProductionYears);

			const formattedPlaces = items.map((item) => ({
				id: item.filmingSeq._text,
				movieTitle: item.movieTitle._text,
				filmingLocation: item.filmingLocation._text,
				productionYear: item.productionYear._text,
				sido: item.sido._text,
				lat: parseFloat(item.latitude._text),
				lng: parseFloat(item.longitude._text),
			}));

			setPlaces(formattedPlaces);
		};

		fetchData();
	}, []);

	const handleFilterChange = (event, setFunction) => {
		setFunction(event.target.value);
	};

	const filteredPlaces = places.filter((place) => {
		return (
			(selectedSido === "" || place.sido === selectedSido) &&
			(selectedMovieTitle === "" || place.movieTitle === selectedMovieTitle) &&
			(selectedProductionYear === "" ||
				place.productionYear === selectedProductionYear)
		);
	});

	if (!isLoaded) return <CircularProgress />;

	return (
		<Box sx={{ height: "100vh", width: "100%" }}>
			<Paper
				elevation={3}
				sx={{
					p: 2,
					mb: 2,
					display: "flex",
					justifyContent: "space-around",
					flexWrap: "wrap",
				}}
			>
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel>Sido</InputLabel>
					<Select
						value={selectedSido}
						onChange={(e) => handleFilterChange(e, setSelectedSido)}
						autoWidth
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
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel>Movie Title</InputLabel>
					<Select
						value={selectedMovieTitle}
						onChange={(e) => handleFilterChange(e, setSelectedMovieTitle)}
						autoWidth
						label="Movie Title"
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{movieTitles.map((title) => (
							<MenuItem key={title} value={title}>
								{title}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel>Production Year</InputLabel>
					<Select
						value={selectedProductionYear}
						onChange={(e) => handleFilterChange(e, setSelectedProductionYear)}
						autoWidth
						label="Production Year"
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{productionYears.map((year) => (
							<MenuItem key={year} value={year}>
								{year}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Paper>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
				{filteredPlaces.map((place) => (
					<Marker
						key={place.id}
						position={{ lat: place.lat, lng: place.lng }}
						onClick={() => setSelectedPlace(place)}
					/>
				))}
				{selectedPlace && (
					<InfoWindow
						position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
						onCloseClick={() => setSelectedPlace(null)}
					>
						<Box>
							<Typography variant="h6">{selectedPlace.movieTitle}</Typography>
							<Typography variant="body2">
								{selectedPlace.filmingLocation}
							</Typography>
							<Typography variant="body2">
								{selectedPlace.productionYear}
							</Typography>
						</Box>
					</InfoWindow>
				)}
			</GoogleMap>
		</Box>
	);
}

export default AllPlacesPage;
