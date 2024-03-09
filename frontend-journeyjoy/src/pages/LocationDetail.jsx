// frontend/src/pages/LocationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import api from "../baseAPI/Api";

const LocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await api.get(`/places/${id}`);
        setLocation(response.data);
      } catch (error) {
        // Handle error: display message, redirect, etc.
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocationDetails();
  }, [id]);

  if (isLoading) return <CircularProgress />;

  if (!location) return <Typography>Location not found.</Typography>;

  return (
    <Container>
      <Typography variant="h4">{location.name}</Typography>
      {/* Add more elements to display other place details */}
    </Container>
  );
};

export default LocationDetail;
