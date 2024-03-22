// frontend/src/components/LocationDetail/LocationDetailDisplay.jsx
import React from "react";
import { Typography, Paper } from "@mui/material";

const LocationDetailDisplay = ({ name, description }) => {
	return (
		<>
			<Typography variant="h4">{name}</Typography>
			<Paper
				elevation={3}
				sx={{ padding: "20px", maxWidth: 800, width: "100%" }}
			>
				<Typography variant="body1" paragraph>
					{description}
				</Typography>
			</Paper>
		</>
	);
};

export default LocationDetailDisplay;
