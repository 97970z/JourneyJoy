// frontend/src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddLocationModal from "../HomeComponents/AddLocationModal";
import { useAuth } from "../../contextAPI/AuthContext";

const CustomAppBar = styled(AppBar)({
	background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
	color: "#FFFFFF",
});

function Navbar() {
	const navigate = useNavigate();
	const { currentUser, logout } = useAuth();
	const [modalOpen, setModalOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleModalOpen = () => {
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	return (
		<CustomAppBar position="static">
			<Toolbar>
				<img
					src="https://res.cloudinary.com/dl6f9clxo/image/upload/v1710141573/journeyjoy/f4wnhnul085ofcadmgjt.ico"
					alt="JourneyJoy"
					style={{
						display: "block",
						marginLeft: "auto",
						marginRight: "auto",
						width: "50px",
						height: "50px",
					}}
				/>
				<Typography
					variant="h6"
					sx={{ flexGrow: 1, fontWeight: "bold", marginLeft: "10px" }}
				>
					<Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
						JourneyJoy
					</Link>
				</Typography>
				{!currentUser ? (
					<Box>
						<Button
							component={Link}
							to="/register"
							sx={{ color: "white", marginRight: 2 }}
						>
							회원가입
						</Button>
						<Button component={Link} to="/login" sx={{ color: "white" }}>
							로그인
						</Button>
					</Box>
				) : (
					<Box display="flex" alignItems="center">
						<Typography variant="body1" sx={{ marginRight: 2 }}>
							{currentUser.username}
						</Typography>
						<Button
							startIcon={<AddCircleOutlineIcon />}
							onClick={handleModalOpen}
							sx={{
								color: "white",
								marginRight: 2,
								border: "1px solid white",
								borderRadius: "5px",
								":hover": {
									backgroundColor: "white",
									color: "coral",
									fontWeight: "bold",
								},
							}}
						>
							장소 추가
						</Button>
						<Button
							startIcon={<LogoutIcon />}
							onClick={handleLogout}
							sx={{ color: "white" }}
						>
							Logout
						</Button>
					</Box>
				)}
			</Toolbar>
			<AddLocationModal
				open={modalOpen}
				handleClose={handleModalClose}
				username={currentUser?.username}
			/>
		</CustomAppBar>
	);
}

export default Navbar;
