// frontend/src/pages/styles/LocationDetailStyles.jsx
import { styled } from "@mui/system";
import { Box, Paper } from "@mui/material";

export const DetailPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));

export const ImageBanner = styled("img")({
	width: "50%",
	objectFit: "cover",
	margin: "auto",
	display: "block",
});

export const ActionContainer = styled(Box)({
	display: "flex",
	justifyContent: "center",
	gap: "10px",
	marginTop: "20px",
});
