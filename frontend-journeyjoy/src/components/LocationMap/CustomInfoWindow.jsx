import { Typography, Paper } from "@mui/material";

const CustomInfoWindow = ({ place }) => {
	return (
		<Paper
			elevation={6}
			sx={{
				padding: 2,
				maxWidth: 300,
				maxHeight: 200,
				position: "relative",
				backgroundColor: "#fafafa",
			}}
		>
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
		</Paper>
	);
};

export default CustomInfoWindow;
