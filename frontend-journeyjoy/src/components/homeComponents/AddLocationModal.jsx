// frontend/src/components/HomeComponents/AddLocationButton.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import api from "../../baseAPI/Api";

const AddLocationModal = ({
  open,
  handleClose,
  refreshLocations,
  username,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    featuredIn: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const locationData = { ...formData, addedBy: username };
    try {
      await api.post("/places/add", locationData);
      handleClose();
      refreshLocations(); // 장소 추가 후 목록을 새로고침
      setFormData({
        name: "",
        location: "",
        description: "",
        imageUrl: "",
        featuredIn: "",
      });
    } catch (error) {
      console.error("Failed to add location", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a New Location</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="location"
          label="Location"
          fullWidth
          variant="outlined"
          value={formData.location}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="imageUrl"
          label="Image URL"
          fullWidth
          variant="outlined"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="featuredIn"
          label="Featured In"
          fullWidth
          variant="outlined"
          value={formData.featuredIn}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Location</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLocationModal;
