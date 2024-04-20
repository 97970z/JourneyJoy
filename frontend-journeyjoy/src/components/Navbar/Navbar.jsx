// frontend/src/components/Navbar/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Menu,
	MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
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
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

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

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<StyledAppBar position="static">
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
					onClick={handleClick}
				>
					<MenuIcon />
				</IconButton>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						"aria-labelledby": "basic-button",
					}}
				>
					<MenuItem onClick={handleClose} component={Link} to="/">
						Home
					</MenuItem>
					<MenuItem onClick={handleClose} component={Link} to="/allplaces">
						All Locations
					</MenuItem>
					{currentUser && currentUser.role === "admin" && (
						<MenuItem onClick={handleClose} component={Link} to="/adminpanel">
							Admin Panel
						</MenuItem>
					)}
				</Menu>
				<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
					<Link to="/" style={{ textDecoration: "none", color: "white" }}>
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
		</StyledAppBar>
	);
}

export default Navbar;
