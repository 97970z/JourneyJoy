// frontend/src/components/DetailComponents/PlaceEditModal.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import api from "../../baseAPI/Api";

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/places/${id}`);
        const { name, location, description } = response.data;
        setFormData({ name, location, description });
      } catch (error) {
        console.error("Failed to fetch location details:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form data:", formData);
      await api.put(`/places/${id}`, formData);
      navigate(`/locations/${id}`);
    } catch (error) {
      console.error("Failed to update location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">Edit Location</Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Button type="submit" disabled={isLoading}>
        Save Changes
      </Button>
    </form>
  );
};

export default EditLocation;
