// frontend/src/components/Logo/Logo.jsx
import { Container } from "@mui/material";

const Logo = () => {
	return (
		<Container>
			<img
				src="https://res.cloudinary.com/dl6f9clxo/image/upload/v1710141573/journeyjoy/f4wnhnul085ofcadmgjt.ico"
				alt="JourneyJoy"
				style={{
					display: "block",
					marginLeft: "auto",
					marginRight: "auto",
					paddingBottom: "30px",
					width: "200px",
					height: "200px",
				}}
			/>
		</Container>
	);
};

export default Logo;
