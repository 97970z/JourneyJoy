// frontend/src/pages/LocationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Typography, CircularProgress } from "@mui/material";
import api from "../baseAPI/Api";
import { useAuth } from "../contextAPI/AuthContext";

const LocationDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      const { data } = await api.get(`/places/${id}`);
      setLocation(data);
      setIsLoading(false);
    };
    fetchLocation();
  }, [id]);

  const handleDelete = async () => {
    await api.delete(`/places/${id}`);
    navigate("/");
  };

  if (isLoading) return <CircularProgress />;

  if (!location) return <Typography>Location not found.</Typography>;

  return (
    <Container>
      <Typography variant="h4">{location?.name}</Typography>
      {location && currentUser?.username === location.addedBy && (
        <div>
          <Button variant="outlined" onClick={() => navigate(`/edit/${id}`)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </Container>
  );
};

export default LocationDetail;
