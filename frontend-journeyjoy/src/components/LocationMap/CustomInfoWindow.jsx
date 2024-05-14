// frontend/src/components/LocationMap/CustomInfoWindow.jsx
import { Box, Typography } from "@mui/material";

const CustomInfoWindow = ({ place }) => {
	return (
		<Box>
			<Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
				{place.movieTitle}
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{place.sceneDesc}
			</Typography>
			<Typography variant="caption" display="block" gutterBottom>
				촬영 장소: {place.filmingLocation}
			</Typography>
			<Typography variant="caption" display="block">
				촬영 연도: {place.productionYear}
			</Typography>
		</Box>
	);
};

export default CustomInfoWindow;
