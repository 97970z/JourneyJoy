// frontend/src/pages/styles/useStyles.js
import { styled } from "@mui/system";

export const StyledContainer = styled("div")({
	maxWidth: "xl",
	margin: "auto",
});

export const StyledHeroBox = styled("div")(({ theme }) => ({
	background: "linear-gradient(45deg, #FE6B8B 15%, #FF8E53 70%)",
	color: "white",
	textAlign: "center",
	padding: theme.spacing(10, 2),
	marginBottom: theme.spacing(4),
	position: "relative",
	borderRadius: "5px",
	boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
	"&:before": {
		content: '""',
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		background: "rgba(0,0,0,0.3)",
		borderRadius: "5px",
	},
	"& > *": { position: "relative", zIndex: 1 },
}));
