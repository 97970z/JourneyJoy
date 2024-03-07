// frontend/src/components/HomeComponents/LocationCard.jsx
import React from "react";
import { Typography } from "@mui/material";
import { StyledCard, StyledCardMedia, OverlayText } from "./StyledComponents";

const LocationCard = ({ imageUrl, name, featuredIn }) => {
  return (
    <StyledCard>
      <StyledCardMedia component="img" image={imageUrl} alt="Location Image" />
      <OverlayText>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2">{featuredIn}</Typography>
      </OverlayText>
    </StyledCard>
  );
};

export default LocationCard;
