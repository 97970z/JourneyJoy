// frontend/src/components/HomeComponents/AddLocationButton.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import api from "../../baseAPI/Api";

const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

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
    featuredIn: "",
    genre: "",
  });
  const [fileError, setFileError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError("이미지 용량은 1.5MB를 넘을 수 없습니다.");
      e.target.value = null;
    } else {
      setFormData({ ...formData, image: file });
      setFileError("");
    }
  };

  const handleSubmit = async () => {
    if (formData.image && formData.image.size > MAX_FILE_SIZE) {
      setFileError("이미지 용량은 1.5MB를 넘을 수 없습니다.");
      return;
    }

    const locationData = new FormData();

    Object.keys(formData).forEach((key) => {
      locationData.append(key, formData[key]);
    });
    locationData.append("addedBy", username);
    try {
      await api.post("/places/add", locationData);
      handleClose();
      refreshLocations();
      setFormData({
        name: "",
        location: "",
        description: "",
        featuredIn: "",
        genre: "",
      });
      setFileError("");
    } catch (error) {
      console.error("Failed to add location", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a New Location</DialogTitle>
      <DialogContent>
        {fileError && <Alert severity="error">{fileError}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="location"
          label="Location"
          fullWidth
          variant="outlined"
          value={formData.location}
          onChange={handleChange}
          required
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
          required
        />
        <TextField
          margin="dense"
          name="featuredIn"
          label="Featured In"
          fullWidth
          variant="outlined"
          value={formData.featuredIn}
          onChange={handleChange}
          required
        />
        <FormControl style={{ width: "30%", marginTop: "10px" }}>
          <Select
            labelId="genre-label"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <MenuItem value={"Movie"}>Movie</MenuItem>
            <MenuItem value={"Drama"}>Drama</MenuItem>
            <MenuItem value={"Anime"}>Anime</MenuItem>
            <MenuItem value={"TV Show"}>TV Show</MenuItem>
          </Select>
        </FormControl>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "10px" }}
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
