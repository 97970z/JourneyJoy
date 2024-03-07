// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Container, Button, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../contextAPI/AuthContext";
import api from "../baseAPI/Api";
import SearchBar from "../components/HomeComponents/SearchBar";
import LocationGrid from "../components/HomeComponents/LocationGrid";
import AddLocationModal from "../components/HomeComponents/AddLocationModal";

function Home() {
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
          position: "relative",
          backgroundImage: "url(./src/assets/icons/tree.jpg)",
          backgroundSize: "cover",
          borderRadius: "8px",
          color: "white",
          textAlign: "center",
          py: 15,
          mb: 4,
          mt: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          JourneyJoy와 함께하는 여행
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          미디어에 나온 장소를 전세계에서 찾아보세요.
        </Typography>
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            position: "absolute",
            backgroundColor: "burlywood",
            fontWeight: "bold",
            boxShadow: 0,
            bottom: 0,
            opacity: 0.9,
            left: "50%",
            transform: "translateX(-50%)",
            py: 2,
            px: 5,

            "&:hover": {
              backgroundColor: "darkkhaki",
              boxShadow: 0,
            },
          }}
          onClick={handleModalOpen}
        >
          Add New Location
        </Button>
      </Box>
      <LocationGrid locations={locations} />
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
