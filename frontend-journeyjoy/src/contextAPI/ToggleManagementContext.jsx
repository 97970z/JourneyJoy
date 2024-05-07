// frontend/src/contextAPI/ToggleManagementContext.jsx
import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Context 생성
const ToggleManagementContext = createContext();

// Provider 구현
export const ToggleManagementProvider = ({ children }) => {
	const [isAccordionOpen, setIsAccordionOpen] = useState(false);
	const [isImageOpen, setIsImageOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState({ severity: "info", message: "" });

	const toggleAccordion = () => setIsAccordionOpen((prev) => !prev);

	const toggleImage = () => setIsImageOpen((prev) => !prev);

	const toggleEditing = () => setIsEditing((prev) => !prev);

	const showAlert = (severity, message) => {
		setAlert({ severity, message });
		setOpen(true);
	};

	const closeAlert = (event, reason) => {
		if (reason === "clickaway") return;
		setOpen(false);
	};

	return (
		<ToggleManagementContext.Provider
			value={{
				isAccordionOpen,
				toggleAccordion,
				isImageOpen,
				toggleImage,
				isEditing,
				toggleEditing,
				showAlert,
				closeAlert,
			}}
		>
			{children}
			<Snackbar open={open} autoHideDuration={5000} onClose={closeAlert}>
				<Alert
					onClose={closeAlert}
					severity={alert.severity}
					sx={{ width: "100%" }}
				>
					{alert.message}
				</Alert>
			</Snackbar>
		</ToggleManagementContext.Provider>
	);
};

// 커스텀 훅 생성
export const useToggleManagement = () => useContext(ToggleManagementContext);
