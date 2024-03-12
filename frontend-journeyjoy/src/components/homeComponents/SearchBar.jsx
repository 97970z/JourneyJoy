// frontend/src/components/HomeComponents/SearchBar.jsx
import React from "react";
import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { StyledTextField, StyledButton } from "./StyledComponents";

const SearchBar = ({ search, setSearch, handleSearchSubmit }) => {
	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	return (
		<Box display="flex" justifyContent="center" alignItems="center">
			<StyledTextField
				label="검색"
				variant="filled"
				value={search}
				onChange={handleSearchChange}
				size="small"
				sx={{ marginRight: 2 }}
			/>
			<StyledButton
				variant="contained"
				color="primary"
				onClick={handleSearchSubmit}
				endIcon={<SearchIcon />}
			>
				Search
			</StyledButton>
		</Box>
	);
};

export default SearchBar;
