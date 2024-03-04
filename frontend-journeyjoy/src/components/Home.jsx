// frontend/src/components/Home.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Icon from "@mui/material/Icon";

function Home() {
  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = () => {
    // 검색 기능 구현
    console.log("Searching for:", search);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to JourneyJoy!
      </Typography>

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Explore Locations
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            fullWidth
            label="Search for a location..."
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            style={{ marginRight: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchSubmit}
          >
            Search
          </Button>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Icon color="primary">add_circle</Icon>}
        >
          Add New Location
        </Button>
      </Box>

      {/* 검색 결과 및 특징 있는 장소들을 표시하는 섹션 (예시) */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Location Name
              </Typography>
              <Typography color="textSecondary">Movie Name</Typography>
              <Typography variant="body2" component="p">
                Location description...
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
        {/* 여러 카드 컴포넌트를 반복해서 추가 */}
      </Grid>
    </Container>
  );
}

export default Home;
