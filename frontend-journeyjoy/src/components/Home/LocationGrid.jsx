// frontend/src/components/Home/LocationGrid.jsx
import React from "react";
import Masonry from "@mui/lab/Masonry";
import LocationCard from "./LocationCard";

const LocationGrid = ({ locations }) => {
	locations.sort((a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt);
	});

	return (
		<Masonry columns={4} spacing={2} sx={{ margin: "0" }}>
			{locations.map((location, index) => (
				<LocationCard key={index} {...location} />
			))}
		</Masonry>
	);
};

export default LocationGrid;
