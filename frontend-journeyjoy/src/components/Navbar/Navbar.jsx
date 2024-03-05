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
        color: "common.snow",
        backgroundColor: "darkkhaki",
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
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: "white" }}
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
