// frontend/src/components/Home.jsx
import React, { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import SearchBar from "../components/homeComponents/SearchBar";
import LocationGrid from "../components/homeComponents/LocationGrid";
import AddLocationButton from "../components/homeComponents/AddLocationButton";

function Home() {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([...Array(6)]);

  const handleSearchSubmit = () => {
    console.log("Searching for:", search);
  };

  return (
    <Container maxWidth="lg">
      {" "}
      <Box
        sx={{
          textAlign: "center",
          paddingY: 8,
          background: "linear-gradient(70deg, #2196F3 30%, #21CBF3 90%)",
          color: "common.white",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          JourneyJoy
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          영화, 드라마, 애니메이션 속 인물들이 다녀간 장소를 찾아보세요.
        </Typography>
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
      </Box>
      <LocationGrid locations={locations} />
      <AddLocationButton />
    </Container>
  );
}

export default Home;
