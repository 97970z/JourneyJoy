// frontend/src/components/LocationMap/InfoWindow_TvFilm.jsx
import { Typography, Divider, Paper } from "@mui/material";

const InfoWindow_TvFilm = ({ tvFilm }) => {
	return (
		<Paper sx={{ padding: 2 }}>
			<Typography
				variant="h6"
				component="h3"
				sx={{ fontWeight: "bold", mb: 1 }}
			>
				{tvFilm.TITLE_NM}
			</Typography>
			<Typography variant="subtitle1" sx={{ mb: 1 }}>
				<em>{tvFilm.MEDIA_TY}</em>
			</Typography>
			<Divider sx={{ my: 1 }} />
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Place:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.PLACE_NM} ({tvFilm.PLACE_TY})
			</Typography>
			<Divider sx={{ my: 1 }} />
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Related Scene:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.RELATE_PLACE_DC}
			</Typography>
			<Divider sx={{ my: 1 }} />
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Operating Time:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.OPER_TIME}
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Rest Time:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.REST_TIME || "Information not available"}
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Closed On:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.RSTDE_GUID_CN}
			</Typography>
			<Divider sx={{ my: 1 }} />
			<Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
				Address:
			</Typography>
			<Typography variant="body2" sx={{ mb: 1 }}>
				{tvFilm.ADDR}
			</Typography>
		</Paper>
	);
};

export default InfoWindow_TvFilm;
