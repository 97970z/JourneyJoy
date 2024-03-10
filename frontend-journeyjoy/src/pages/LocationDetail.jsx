// frontend/src/pages/LocationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
      const response = await api.get(`/places/${id}`);
      setLocation(response.data);
      setIsLoading(false);
    };
    fetchLocation();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/places/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  if (isLoading) return <CircularProgress />;

  if (!location) return <Typography>Location not found.</Typography>;

  return (
    <Container>
      <Typography variant="h4">{location.name}</Typography>
      <img
        src={location.imageUrl}
        alt={location.name}
        style={{ width: "100%", height: "auto", margin: "20px 0" }}
      />
      <Typography variant="body1">{location.description}</Typography>
      {currentUser?.username === location.addedBy && (
        <div>
          <Button
            component={Link}
            to={`/edit/${id}`}
            variant="outlined"
            style={{ marginRight: "10px" }}
          >
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
