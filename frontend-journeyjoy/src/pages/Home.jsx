// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { usePlaces } from "../contextAPI/PlacesContext";
import Logo from "../components/Logo/Logo";
import SearchBar from "../components/Home/SearchBar";
import LocationGrid from "../components/Home/LocationGrid";
import SearchFilters from "../components/Home/SearchFilters";
import { HomeContainer, HomeBox } from "./styles/HomeStyles";

function Home() {
	const { userPlaces, isLoading } = usePlaces();
	const [search, setSearch] = useState("");
	const [filteredLocations, setFilteredLocations] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [allGenres, setAllGenres] = useState([
		"Movie",
		"Drama",
		"Anime",
		"TV Show",
	]);

	const filterLocations = () => {
		if (selectedGenres.length === 0) {
			setFilteredLocations(userPlaces);
		} else {
			const filtered = userPlaces.filter((location) =>
				selectedGenres.some((genre) => location.genre.includes(genre)),
			);
			setFilteredLocations(filtered);
		}
	};

	const handleSearchSubmit = async () => {
		if (!search) {
			setFilteredLocations(userPlaces);
			return;
		}

		const filtered = userPlaces.filter(
			(location) =>
				location.name.toLowerCase().includes(search.toLowerCase()) ||
				location.description.toLowerCase().includes(search.toLowerCase()) ||
				location.location.toLowerCase().includes(search.toLowerCase()) ||
				location.featuredIn.some((feature) =>
					feature.toLowerCase().includes(search.toLowerCase()),
				),
		);
		setFilteredLocations(filtered);
	};

	useEffect(() => {
		filterLocations();
	}, [userPlaces, selectedGenres]);

	if (isLoading) return <Typography>데이터 로딩중...</Typography>;

	return (
		<HomeContainer>
			<HomeBox>
				<Logo />
				<Typography variant="h5" sx={{ mb: 4 }}>
					지금 바로 JourneyJoy와 함께 여행을 떠나보세요!
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<SearchBar
						search={search}
						setSearch={setSearch}
						handleSearchSubmit={handleSearchSubmit}
					/>
				</Box>
			</HomeBox>
			<SearchFilters
				selectedGenres={selectedGenres}
				setSelectedGenres={setSelectedGenres}
				allGenres={allGenres}
			/>
			<LocationGrid locations={filteredLocations} />
		</HomeContainer>
	);
}

export default Home;
