// frontend/src/components/HomeComponents/LocationCard.jsx
import React from "react";
import { Typography, CardActionArea } from "@mui/material";
import { StyledCard, StyledCardMedia, OverlayText } from "./StyledComponents";

const LocationCard = ({ imageUrl, name, featuredIn }) => {
  const transformedImageUrl = imageUrl.replace(
    "/upload/",
    "/upload/c_fill,h_300,w_400/" // Change '300' and '400' to the desired height and width
  );

  return (
    <StyledCard>
      <CardActionArea>
        <StyledCardMedia
          image={transformedImageUrl}
          title={name}
          alt="Location Image"
        >
          <OverlayText>
            <Typography variant="h6" component="h2" color="common.white">
              {name}
            </Typography>
            <Typography variant="body2" color="common.white">
              Featured in: {featuredIn}
            </Typography>
          </OverlayText>
        </StyledCardMedia>
      </CardActionArea>
    </StyledCard>
  );
};

export default LocationCard;
