// frontend/src/pages/styles/useStyles.js
import { styled } from "@mui/system";
import { Container, Box, Button } from "@mui/material";

export const StyledContainer = styled(Container)({
  maxWidth: "xl",
});

export const StyledHeroBox = styled(Box)({
  backgroundImage: "url(./src/assets/icons/tree.jpg)",
  backgroundSize: "cover",
  color: "white",
  textAlign: "center",
  padding: "100px 0",
  marginBottom: "20px",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

export const StyledActionButton = styled(Button)({
  backgroundColor: "burlywood",
});
