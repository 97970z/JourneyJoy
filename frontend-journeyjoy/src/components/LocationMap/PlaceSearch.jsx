// src/components/LocationMap/PlaceSearch.jsx
import { Box, TextField } from "@mui/material";

const PlaceSearch = ({ searchTerm, setSearchTerm }) => {
	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<Box style={{ display: "flex", alignItems: "center", width: "80%" }}>
			<TextField
				label="Search by Movie Title"
				variant="outlined"
				value={searchTerm}
				onChange={handleSearchChange}
				style={{ flex: 1 }}
			/>
		</Box>
	);
};

export default PlaceSearch;
