// frontend/src/components/HomeComponents/LocationCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, CardActionArea } from "@mui/material";
import { StyledCard, StyledCardMedia, OverlayText } from "./StyledComponents";

const LocationCard = ({ _id, imageUrl, name, featuredIn }) => {
	const navigate = useNavigate();

	const defaultImageUrl =
		"https://res.cloudinary.com/dl6f9clxo/image/upload/v1710141573/journeyjoy/f4wnhnul085ofcadmgjt.ico";

	const transformedImageUrl = imageUrl
		? imageUrl.replace("/upload/", "/upload/c_fill,h_300,w_400/")
		: defaultImageUrl;

	const goToDetailPage = (id) => () => {
		navigate(`/locations/${id}`);
	};

	return (
		<StyledCard onClick={goToDetailPage(_id)}>
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
							출연작: {featuredIn}
						</Typography>
					</OverlayText>
				</StyledCardMedia>
			</CardActionArea>
		</StyledCard>
	);
};

export default LocationCard;
