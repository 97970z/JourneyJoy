// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { usePlaces } from "../contextAPI/PlacesContext";
import SearchBar from "../components/HomeComponents/SearchBar";
import LocationGrid from "../components/HomeComponents/LocationGrid";
import SearchFilters from "../components/HomeComponents/SearchFilters";
import { StyledContainer, StyledHeroBox } from "./styles/HomeStyles";

function Home() {
  const { places, isLoading } = usePlaces();
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
      setFilteredLocations(places);
    } else {
      const filtered = places.filter((location) =>
        selectedGenres.some((genre) => location.genre.includes(genre)),
      );
      setFilteredLocations(filtered);
    }
  };

  const handleSearchSubmit = async () => {
    if (!search) {
      setFilteredLocations(places);
      return;
    }

    const filtered = places.filter(
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
  }, [places, selectedGenres]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <StyledContainer>
      <StyledHeroBox>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ position: "relative", fontWeight: "bold" }}
        >
          JourneyJoy
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, position: "relative" }}>
          지금 바로 JourneyJoy와 함께 여행을 떠나보세요!
        </Typography>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Box>
      </StyledHeroBox>
      <SearchFilters
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        allGenres={allGenres}
      />
      <LocationGrid locations={filteredLocations} />
    </StyledContainer>
  );
}

export default Home;
