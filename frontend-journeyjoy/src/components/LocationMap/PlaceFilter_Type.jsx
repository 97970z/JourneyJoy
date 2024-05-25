import { Chip, AccordionDetails } from "@mui/material";

function PlaceFilter_Type({ types, selectedType, setSelectedType }) {
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
			{types.map((type) => (
				<Chip
					key={type}
					label={type}
					onClick={() => setSelectedType(type)}
					variant={selectedType === type ? "filled" : "outlined"}
					color={selectedType === type ? "primary" : "secondary"}
				/>
			))}
		</AccordionDetails>
	);
}

export default PlaceFilter_Type;
