// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAPI/AuthContext.jsx";
import Logo from "../components/Logo/Logo.jsx";
import AuthenticationForm from "../components/Login/AuthenticationForm.jsx";
import FormContainer from "../components/Login/FormContainer.jsx";
import { Snackbar, Alert } from "@mui/material";

function Login() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { currentUser, login } = useAuth();
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState({ severity: "info", message: "" });

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	}, [currentUser, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(username, password);
			navigate("/");
		} catch (error) {
			setAlert({ severity: "error", message: error.response.data.message });
			setOpen(true);
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		<div className="register" style={{ marginTop: "100px" }}>
			<Logo />
			<FormContainer title="Login">
				<AuthenticationForm
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
					handleSubmit={handleSubmit}
					action="Login"
				/>
			</FormContainer>
			<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={alert.severity}
					sx={{ width: "100%" }}
				>
					{alert.message}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default Login;
