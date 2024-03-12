// frontend/src/components/HomeComponents/SearchFilters.jsx
import React from "react";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

const SearchFilters = ({ selectedGenres, setSelectedGenres, allGenres }) => {
  const handleGenreChange = (event) => {
    const genre = event.target.name;
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre],
    );
  };

  return (
    <FormGroup row>
      {allGenres.map((genre) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedGenres.includes(genre)}
              onChange={handleGenreChange}
              name={genre}
            />
          }
          label={genre}
          key={genre}
        />
      ))}
    </FormGroup>
  );
};

export default SearchFilters;
