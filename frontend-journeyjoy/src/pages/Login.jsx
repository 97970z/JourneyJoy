// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextAPI/AuthContext.jsx";
import { useToggleManagement } from "../contextAPI/ToggleManagementContext";
import Logo from "../components/Logo/Logo.jsx";
import AuthenticationForm from "../components/Login/AuthenticationForm.jsx";
import FormContainer from "../components/Login/FormContainer.jsx";

function Login() {
	const navigate = useNavigate();
	const { showAlert } = useToggleManagement();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { currentUser, login } = useAuth();

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
			showAlert("error", error.response.data.message);
		}
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
		</div>
	);
}

export default Login;
