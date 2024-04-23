// frontend/src/components/LocationMap/PlaceFilter.jsx
import React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

const PlaceFilter = ({
	isOpen,
	toggleDrawer,
	sidos,
	selectedSido,
	setSelectedSido,
}) => {
	return (
		<Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
			<Box
				sx={{ width: 250 }}
				role="presentation"
				onClick={toggleDrawer(false)}
				onKeyDown={toggleDrawer(false)}
			>
				<List>
					<ListItem>
						<FormControl fullWidth>
							<InputLabel>Sido</InputLabel>
							<Select
								value={selectedSido}
								onChange={(e) => setSelectedSido(e.target.value)}
								label="Sido"
							>
								{sidos.map((sido, index) => (
									<MenuItem key={index} value={sido}>
										{sido}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</ListItem>
				</List>
			</Box>
		</Drawer>
	);
};

export default PlaceFilter;
