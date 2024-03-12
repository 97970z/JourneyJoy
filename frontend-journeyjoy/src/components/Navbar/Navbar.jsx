// frontend/src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contextAPI/AuthContext";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddLocationModal from "../HomeComponents/AddLocationModal";

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
		<AppBar
			position="static"
			sx={{ color: "common.white", backgroundColor: "darkkhaki" }}
		>
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
						<IconButton color="inherit" onClick={handleModalOpen}>
							<AddCircleOutlineIcon />
						</IconButton>
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
		</AppBar>
	);
}

export default Navbar;
