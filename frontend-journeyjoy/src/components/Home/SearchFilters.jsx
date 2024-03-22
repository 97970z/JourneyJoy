// frontend/src/components/HomeComponents/SearchFilters.jsx
import React from "react";
import { Chip, Stack } from "@mui/material";

const SearchFilters = ({ selectedGenres, setSelectedGenres, allGenres }) => {
	const handleGenreChange = (genre) => () => {
		setSelectedGenres((prevSelectedGenres) =>
			prevSelectedGenres.includes(genre)
				? prevSelectedGenres.filter((g) => g !== genre)
				: [...prevSelectedGenres, genre],
		);
	};

	return (
		<Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
			{allGenres.map((genre) => (
				<Chip
					key={genre}
					label={genre}
					clickable
					color={selectedGenres.includes(genre) ? "primary" : "default"}
					onClick={handleGenreChange(genre)}
					variant="outlined"
				/>
			))}
		</Stack>
	);
};

export default SearchFilters;
