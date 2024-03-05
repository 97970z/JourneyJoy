// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
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
      console.error("Failed to fetch places:", error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearchSubmit = () => {
    console.log("Searching for:", search);
  };

  return (
    <Container maxWidth="lg">
      <Container
        style={{
          backgroundImage: "url(./src/assets/icons/tree.jpg)",
          backgroundSize: "cover",
          borderRadius: "8px",
          marginTop: "20px",
          paddingBottom: "500px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            paddingY: 8,
            color: "mintcream",
            marginBottom: 4,
          }}
        >
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Box>
      </Container>
      <LocationGrid locations={locations} />
      <Box textAlign="center" my={4}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ borderColor: "primary.main", color: "primary.main" }}
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
