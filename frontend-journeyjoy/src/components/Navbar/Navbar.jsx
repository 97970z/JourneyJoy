// frontend/src/components/Navbar/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Typography,
	Breadcrumbs,
	AppBar,
	Toolbar,
	Button,
	Box,
} from "@mui/material";
import { styled } from "@mui/system";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddLocationModal from "../Home/AddLocationModal";
import { useAuth } from "../../contextAPI/AuthContext";

const StyledAppBar = styled(AppBar)({
	background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
	color: "#FFFFFF",
	boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
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
		<StyledAppBar position="static">
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<Breadcrumbs aria-label="breadcrumb">
					<Link to="/" style={{ textDecoration: "none" }}>
						<Typography
							style={{ display: "flex", alignItems: "center" }}
							color="text.primary"
						>
							<HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
							Home
						</Typography>
					</Link>
					<Link to="/allplaces" style={{ textDecoration: "none" }}>
						<Typography
							style={{ display: "flex", alignItems: "center" }}
							color="text.primary"
						>
							<MapIcon sx={{ mr: 0.5 }} fontSize="inherit" />
							All Places
						</Typography>
					</Link>
					{currentUser && currentUser.role === "admin" && (
						<Link to="/adminpanel" style={{ textDecoration: "none" }}>
							<Typography
								style={{ display: "flex", alignItems: "center" }}
								color="text.primary"
							>
								<MapIcon sx={{ mr: 0.5 }} fontSize="inherit" />
								Admin Panel
							</Typography>
						</Link>
					)}
				</Breadcrumbs>
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
						<Button
							startIcon={<AddCircleOutlineIcon />}
							onClick={handleModalOpen}
							sx={{
								fontSize: "1rem",
								color: "black",
								marginRight: 2,
								marginTop: 0.5,
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
							sx={{
								borderRadius: "5px",
								":hover": {
									backgroundColor: "white",
								},
							}}
						>
							<Typography
								onClick={handleLogout}
								style={{ display: "flex", alignItems: "center" }}
								color="text.primary"
							>
								<LogoutIcon sx={{ mr: 0.5 }} fontSize="inherit" />
								LOGOUT
							</Typography>
						</Button>
					</Box>
				)}

				<AddLocationModal
					open={modalOpen}
					handleClose={handleModalClose}
					username={currentUser?.username}
				/>
			</Toolbar>
		</StyledAppBar>
	);
}

export default Navbar;
