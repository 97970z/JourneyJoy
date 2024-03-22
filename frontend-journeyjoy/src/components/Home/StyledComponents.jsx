// frontend/src/components/HomeComponents/StyledComponents.jsx
import { styled } from "@mui/system";
import { TextField, Button, Box, Card, CardMedia } from "@mui/material";

export const StyledCard = styled(Card)({
	position: "relative",
	borderRadius: "8px",
	width: "100%",
	height: "300px",
	overflow: "hidden",
	"&:hover": {
		"& $OverlayText": {
			opacity: 1,
		},
	},
});

export const StyledCardMedia = styled(CardMedia)({
	position: "relative",
	height: 300,
	objectFit: "cover",
});

export const OverlayText = styled(Box)(({ theme }) => ({
	position: "absolute",
	bottom: 0,
	left: 0,
	padding: theme.spacing(2),
	color: "white",
	fontWeight: "bold",
	background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
	width: "100%",
	boxSizing: "border-box",
	transition: "opacity 0.5s",
	opacity: 0.7,
	"&:hover": {
		opacity: 1,
	},
}));

export const StyledTextField = styled(TextField)({
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	borderRadius: "4px",
});

export const StyledButton = styled(Button)({
	boxShadow: "none",
	textTransform: "none",
	fontSize: 16,
	padding: "6px 12px",
	lineHeight: 2,
	backgroundColor: "#00ccff",
	"&:hover": {
		backgroundColor: "#0066ff",
		boxShadow: "none",
	},
	"&:active": {
		boxShadow: "none",
		backgroundColor: "#0066ff",
	},
});
