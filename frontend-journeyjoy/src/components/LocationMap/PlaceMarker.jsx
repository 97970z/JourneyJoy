// frontend/src/components/LocationMap/PlacesMarker.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../../pages/styles/CustomPopup.css";

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
				<div className="custom-popup">
					<div className="custom-popup-header">{place.movieTitle}</div>
					<div className="custom-popup-body">
						{place.sceneDesc && (
							<div className="custom-popup-section">
								<div className="custom-popup-title">촬영 장면 설명</div>
								<div className="custom-popup-content">{place.sceneDesc}</div>
							</div>
						)}
						<div className="custom-popup-section">
							<div className="custom-popup-title">촬영 장소</div>
							<div className="custom-popup-content">
								{place.filmingLocation}
							</div>
						</div>
						<div className="custom-popup-section">
							<div className="custom-popup-title">촬영 연도</div>
							<div className="custom-popup-content">{place.productionYear}</div>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};

export default PlaceMarker;
