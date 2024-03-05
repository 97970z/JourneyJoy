// frontend/src/pages/Home.jsx
import React, { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import SearchBar from "../components/HomeComponents/SearchBar";
import LocationGrid from "../components/HomeComponents/LocationGrid";
import AddLocationButton from "../components/HomeComponents/AddLocationButton";

function Home() {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([...Array(6)]);

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
          <img
            src="./src/assets/icons/journeyjoy.ico"
            alt="JourneyJoy"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              width: "150px",
              height: "150px",
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            JourneyJoy
          </Typography>
          <Typography variant="h5" sx={{ mb: 10 }}>
            영화, 드라마, 애니메이션 속 인물들이 다녀간 장소를 찾아보세요.
          </Typography>
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Box>
      </Container>
      <LocationGrid locations={locations} />
      <AddLocationButton />
    </Container>
  );
}

export default Home;
