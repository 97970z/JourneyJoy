// frontend/src/components/LocationDetail/LocationDetailForm.jsx
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from "@mui/material";

const LocationDetailForm = ({ formData, handleChange }) => {
	return (
		<Box sx={{ padding: 3 }}>
			<TextField
				label="Name"
				name="name"
				fullWidth
				variant="outlined"
				value={formData.name}
				onChange={handleChange}
				margin="normal"
			/>
			<TextField
				label="Description"
				name="description"
				fullWidth
				variant="outlined"
				multiline
				rows={4}
				value={formData.description}
				onChange={handleChange}
				margin="normal"
			/>
			<TextField
				label="Featured In"
				name="featuredIn"
				fullWidth
				variant="outlined"
				value={formData.featuredIn}
				onChange={handleChange}
				margin="normal"
			/>
			<FormControl fullWidth sx={{ mt: 2 }}>
				<InputLabel id="genre-select-label">장르</InputLabel>
				<Select
					labelId="genre-select-label"
					id="genre"
					name="genre"
					value={formData.genre}
					label="Genre"
					onChange={handleChange}
					required
				>
					<MenuItem value="Movie">영화</MenuItem>
					<MenuItem value="Drama">드라마</MenuItem>
					<MenuItem value="Anime">애니메이션</MenuItem>
					<MenuItem value="TV Show">TV 프로그램</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};

export default LocationDetailForm;
