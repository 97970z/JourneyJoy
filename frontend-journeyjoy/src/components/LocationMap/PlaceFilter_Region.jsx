// frontend/src/components/LocationMap/PlaceFilter_Region.jsx
import { Chip, AccordionDetails } from "@mui/material";

function PlaceFilter_Region({ sidos, selectedSido, setSelectedSido }) {
	return (
		<AccordionDetails
			sx={{
				px: 2,
				py: 1,
				display: "flex",
				justifyContent: "center",
				flexWrap: "wrap",
				gap: 1,
			}}
		>
			{sidos.map((sido) => (
				<Chip
					key={sido}
					label={sido}
					onClick={() => setSelectedSido(sido)}
					variant={selectedSido === sido ? "filled" : "outlined"}
					color={selectedSido === sido ? "primary" : "success"}
				/>
			))}
		</AccordionDetails>
	);
}

export default PlaceFilter_Region;
