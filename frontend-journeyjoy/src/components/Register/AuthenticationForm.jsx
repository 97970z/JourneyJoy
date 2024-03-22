// frontend/src/components/Register/AuthenticationForm.jsx
import React from "react";
import { TextField, Button, Box } from "@mui/material";

const AuthenticationForm = ({
	username,
	setUsername,
	password,
	setPassword,
	handleSubmit,
	action,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<TextField
				label="Username"
				variant="outlined"
				fullWidth
				margin="normal"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<TextField
				label="Password"
				variant="outlined"
				fullWidth
				margin="normal"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Box display="flex" justifyContent="flex-end" marginTop="16px">
				<Button type="submit" variant="contained" color="primary">
					{action}
				</Button>
			</Box>
		</form>
	);
};

export default AuthenticationForm;
