// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAPI/AuthContext.jsx";
import Logo from "../components/Logo/Logo.jsx";
import AuthenticationForm from "../components/Register/AuthenticationForm.jsx";
import FormContainer from "../components/Register/FormContainer.jsx";

function Register() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { currentUser, register } = useAuth();

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	}, [currentUser, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await register(username, password);
			navigate("/login");
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return (
		<div className="register" style={{ marginTop: "100px" }}>
			<Logo />
			<FormContainer title="Register">
				<AuthenticationForm
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
					handleSubmit={handleSubmit}
					action="Register"
				/>
			</FormContainer>
		</div>
	);
}

export default Register;
