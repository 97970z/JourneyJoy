// frontend/src/components/Login/FormContainer.jsx
import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const FormContainer = ({ title, children }) => {
	return (
		<Container maxWidth="sm">
			<Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
				<Typography variant="h5" component="h1" gutterBottom>
					{title}
				</Typography>
				{children}
			</Paper>
		</Container>
	);
};

export default FormContainer;
