// frontend/src/components/homeComponents/AddLocationButton.jsx
import React from "react";
import { Box, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AddLocationButton = () => {
  return (
    <Box textAlign="center" my={4}>
      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        sx={{ borderColor: "primary.main", color: "primary.main" }}
      >
        Add New Location
      </Button>
    </Box>
  );
};

export default AddLocationButton;
