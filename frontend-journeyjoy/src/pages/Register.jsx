// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAPI/AuthContext";
import { useToggleManagement } from "../contextAPI/ToggleManagementContext";
import Logo from "../components/Logo/Logo";
import AuthenticationForm from "../components/Register/AuthenticationForm";
import FormContainer from "../components/Register/FormContainer";

function Register() {
	const navigate = useNavigate();
	const { showAlert } = useToggleManagement();
	const { currentUser, register } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	}, [currentUser, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			showAlert("error", "비밀번호가 일치하지 않습니다.");
			return;
		}
		try {
			await register(username, password, email);

			showAlert("success", "회원가입이 완료되었습니다. 이메일을 확인해주세요.");
			navigate("/login");
		} catch (error) {
			const errorData = error.response.data.errors;
			if (Array.isArray(errorData)) {
				errorData.forEach((errorItem) => {
					showAlert("error", errorItem.msg);
				});
			} else {
				showAlert(
					"error",
					error.response?.data?.message || "서버 오류가 발생했습니다.",
				);
			}
		}
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
		</div>
	);
}

export default Register;
