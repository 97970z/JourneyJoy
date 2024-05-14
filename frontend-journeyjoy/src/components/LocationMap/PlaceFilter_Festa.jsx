// frontend/src/components/LocationMap/PlaceFilter_Festa.jsx
import { Chip, AccordionDetails } from "@mui/material";

function PlaceFilter_Festa({
	codenames,
	selectedCodename,
	setSelectedCodename,
}) {
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
			{codenames.map((codename) => (
				<Chip
					key={codename}
					label={codename}
					onClick={() => setSelectedCodename(codename)}
					variant={selectedCodename === codename ? "filled" : "outlined"}
					color={selectedCodename === codename ? "success" : "primary"}
				/>
			))}
		</AccordionDetails>
	);
}

export default PlaceFilter_Festa;
