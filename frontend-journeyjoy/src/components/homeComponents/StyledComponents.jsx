// frontend/src/components/HomeComponents/StyledComponents.jsx
import { styled } from "@mui/system";
import { Card, CardMedia, TextField, Button } from "@mui/material";

export const StyledCard = styled(Card)({
  borderRadius: "8px",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

export const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: "cover",
});

export const StyledTextField = styled(TextField)({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "4px",
});

export const StyledButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  lineHeight: 2,
  backgroundColor: "burlywood",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "darkkhaki",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "darkkhaki",
  },
});
