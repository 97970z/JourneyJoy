// frontend/src/components/LocationMap/InfoWindow_Festa.jsx
import { Box, Typography, Link } from "@mui/material";

const InfoWindow_Festa = ({ festival }) => {
	return (
		<Box sx={{ padding: 2 }}>
			<Typography variant="h6" component="div">
				{festival.TITLE}
			</Typography>
			<Typography color="text.secondary">{festival.DATE}</Typography>
			<Typography variant="body2" color="text.secondary">
				{festival.PLACE} - {festival.GUNAME}
			</Typography>
			<Typography variant="body2" component="div">
				가격: {festival.USE_FEE}
			</Typography>
			<Link href={festival.HMPG_ADDR} target="_blank" rel="noopener">
				자세히 알아보기
			</Link>
		</Box>
	);
};

export default InfoWindow_Festa;
