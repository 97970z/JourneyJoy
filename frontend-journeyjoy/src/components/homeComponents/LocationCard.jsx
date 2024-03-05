// frontend/src/components/HomeComponents/LocationCard.jsx
import React from "react";
import { Typography, CardContent, CardActions, Button } from "@mui/material";
import { StyledCard, StyledCardMedia } from "./StyledComponents";

const LocationCard = ({ imageUrl, name, featuredIn }) => {
  return (
    <StyledCard>
      <StyledCardMedia component="img" image={imageUrl} alt="Location Image" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {featuredIn}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </StyledCard>
  );
};

export default LocationCard;
