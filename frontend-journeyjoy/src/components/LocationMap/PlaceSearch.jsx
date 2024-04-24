// frontend/src/components/LocationMap/PlaceSearch.jsx
import { Box, TextField } from "@mui/material";

const PlaceSearch = ({ searchTerm, setSearchTerm }) => {
	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<Box>
			<TextField
				label="영화 제목을 검색하세요"
				variant="outlined"
				value={searchTerm}
				onChange={handleSearchChange}
				style={{ flex: 1, backgroundColor: "white" }}
			/>
		</Box>
	);
};

export default PlaceSearch;
