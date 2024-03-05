// frontend/src/components/HomeComponents/LocationGrid.jsx
import React from "react";
import { Grid } from "@mui/material";
import LocationCard from "./LocationCard";

const LocationGrid = ({ locations }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {" "}
      {locations.map((location, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <LocationCard {...location} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LocationGrid;
