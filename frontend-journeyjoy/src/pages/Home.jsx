// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Container, Button, Typography, useTheme } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../contextAPI/AuthContext";
import api from "../baseAPI/Api";
import SearchBar from "../components/HomeComponents/SearchBar";
import LocationGrid from "../components/HomeComponents/LocationGrid";
import AddLocationModal from "../components/HomeComponents/AddLocationModal";

function Home() {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await api.get("/places");
      setLocations(data);
    } catch (error) {
      console.error("장소 불러오기 실패 :", error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearchSubmit = () => {
    console.log("검색:", search);
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          backgroundImage: "url(./src/assets/icons/tree.jpg)",
          backgroundSize: "cover",
          color: theme.palette.common.white,
          textAlign: "center",
          py: theme.spacing(10),
          mb: theme.spacing(4),
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        }}
      >
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
      </Box>
      <LocationGrid locations={locations} />
      <Box textAlign="center" my={4}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={handleModalOpen}
        >
          Add New Location
        </Button>
      </Box>
      <AddLocationModal
        open={modalOpen}
        handleClose={handleModalClose}
        refreshLocations={fetchLocations}
        username={currentUser?.username}
      />
    </Container>
  );
}

export default Home;
