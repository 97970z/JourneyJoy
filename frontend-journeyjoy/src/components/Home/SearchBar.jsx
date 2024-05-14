// frontend/src/components/Home/SearchBar.jsx
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
				label="검색어를 입력하세요."
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
				검색
			</StyledButton>
		</Box>
	);
};

export default SearchBar;
