// frontend/src/components/LocationMap/PlacesMarker.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
	iconUrl:
		"https://res.cloudinary.com/dl6f9clxo/image/upload/v1711023540/journeyjoy/rc5rmev7gsotxieckjp9.svg",
	iconSize: [30, 30],
	iconAnchor: [17, 30],
	popupAnchor: [0, -30],
});

const PlaceMarker = ({ place }) => {
	return (
		<Marker position={[place.lat, place.lng]} icon={customIcon}>
			<Popup>
				{place.movieTitle}
				<br />
				{place.filmingLocation}
				<br />
				{place.productionYear}
			</Popup>
		</Marker>
	);
};

export default PlaceMarker;
