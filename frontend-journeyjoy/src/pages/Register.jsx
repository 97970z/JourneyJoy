// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAPI/AuthContext";
import Logo from "../components/Logo/Logo";
import AuthenticationForm from "../components/Register/AuthenticationForm";
import FormContainer from "../components/Register/FormContainer";
import { Snackbar, Alert } from "@mui/material";

function Register() {
	const navigate = useNavigate();
	const { currentUser, register } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState({ severity: "info", message: "" });

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	}, [currentUser, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setAlert({ severity: "error", message: "비밀번호가 일치하지 않습니다." });
			setOpen(true);
			return;
		}
		try {
			await register(username, password, email);
			navigate("/login");
			setAlert({
				severity: "success",
				message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
			});
			setOpen(true);
		} catch (error) {
			error.response.data.errors.forEach((error) => {
				setAlert({ severity: "error", message: error.msg });
				setOpen(true);
			});
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
			<FormContainer title="Register">
				<AuthenticationForm
					username={username}
					setUsername={setUsername}
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					confirmPassword={confirmPassword}
					setConfirmPassword={setConfirmPassword}
					handleSubmit={handleSubmit}
					action="Register"
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

export default Register;
