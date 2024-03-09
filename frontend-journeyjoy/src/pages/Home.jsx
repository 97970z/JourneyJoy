// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../contextAPI/AuthContext";
import api from "../baseAPI/Api";
import SearchBar from "../components/HomeComponents/SearchBar";
import LocationGrid from "../components/HomeComponents/LocationGrid";
import AddLocationModal from "../components/HomeComponents/AddLocationModal";
import SearchFilters from "../components/HomeComponents/SearchFilters";
import {
  StyledContainer,
  StyledHeroBox,
  StyledActionButton,
} from "./styles/homeStyles";

function Home() {
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  useEffect(() => {
    fetchLocations();
    fetchGenres();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, selectedGenres]);

  const fetchLocations = async () => {
    try {
      const { data } = await api.get("/places");
      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error("장소 불러오기 실패 :", error);
    }
  };

  const fetchGenres = async () => {
    setAllGenres(["Movie", "Drama", "Anime", "TV Show"]);
  };

  const filterLocations = () => {
    if (selectedGenres.length === 0) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter((location) =>
        selectedGenres.some((genre) => location.genre.includes(genre))
      );
      setFilteredLocations(filtered);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearchSubmit = async () => {
    if (!search) {
      await fetchLocations(); // 검색어가 없으면 모든 장소를 다시 불러옴
      return;
    }
    try {
      const { data } = await api.get(
        `/places/search?q=${encodeURIComponent(search)}`
      );
      setLocations(data); // 검색 결과로 상태를 업데이트
    } catch (error) {
      console.error("검색 실패 :", error);
    }
  };

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
      <Box textAlign="center" my={4}>
        <StyledActionButton
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleModalOpen}
        >
          Add New Location
        </StyledActionButton>
      </Box>
      <AddLocationModal
        open={modalOpen}
        handleClose={handleModalClose}
        refreshLocations={fetchLocations}
        username={currentUser?.username}
      />
    </StyledContainer>
  );
}

export default Home;
