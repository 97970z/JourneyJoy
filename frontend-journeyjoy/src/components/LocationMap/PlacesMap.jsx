// frontend/src/components/LocationMap/PlacesMap.jsx
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import PlaceMarker from "./PlaceMarker";

const PlacesMap = ({ places }) => {
	return (
		<MapContainer
			className="markercluster-map"
			center={[37.5665, 126.978]}
			zoom={7}
			style={{ height: "70vh", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>
			<MarkerClusterGroup chunkedLoading>
				{/* {places
					.filter((place) => place.sceneDesc && place.sceneDesc.trim() !== "")
					.map((place, index) => (
						<PlaceMarker key={index} place={place} />
					))} */}
				{places.map((place, index) => (
					<PlaceMarker key={index} place={place} />
				))}
			</MarkerClusterGroup>
		</MapContainer>
	);
};

export default PlacesMap;
