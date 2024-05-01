// frontend/src/components/LocationDetail/LocationDetailDisplay.jsx
import { Typography, Paper } from "@mui/material";

const LocationDetailDisplay = ({
	name,
	description,
	featuredIn,
	genre,
	location,
}) => {
	return (
		<Paper
			elevation={6}
			sx={{ padding: 3, margin: 2, backgroundColor: "#f7f7f7" }}
		>
			<Typography variant="h4" gutterBottom component="div">
				{name}
			</Typography>
			<hr />
			<Typography variant="body1" paragraph>
				{description}
			</Typography>
			<Typography variant="body2" color="textSecondary">
				위치: {location}
			</Typography>
			<Typography variant="body2" color="textSecondary">
				출연작: {featuredIn}
			</Typography>
			<Typography variant="body2" color="textSecondary">
				장르: {genre}
			</Typography>
		</Paper>
	);
};

export default LocationDetailDisplay;
