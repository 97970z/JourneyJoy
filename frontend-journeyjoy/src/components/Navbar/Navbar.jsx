// frontend/src/components/Navbar/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contextAPI/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        color: "black",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            JourneyJoy
          </Link>
        </Typography>
        {!currentUser ? (
          <Box>
            <Button
              component={Link}
              to="/register"
              sx={{ color: "black", marginRight: 2 }}
            >
              Register
            </Button>
            <Button component={Link} to="/login" sx={{ color: "black" }}>
              Login
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {currentUser.username}
            </Typography>
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: "black" }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
