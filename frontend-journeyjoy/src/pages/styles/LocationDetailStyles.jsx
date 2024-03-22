// frontend/src/pages/styles/LocationDetailStyles.jsx
import { styled } from "@mui/system";

import { Container } from "@mui/material";

export const LocationDetailContainer = styled(Container)({
	marginTop: "20px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "20px",
});

export const Image = styled("img")({
	maxWidth: "100%",
	borderRadius: "5px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});
