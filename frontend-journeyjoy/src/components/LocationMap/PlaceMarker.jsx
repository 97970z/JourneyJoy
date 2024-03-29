// frontend/src/components/LocationMap/PlacesMarker.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
	CustomPopup,
	CustomPopupHeader,
	CustomPopupBody,
	CustomPopupSection,
	CustomPopupTitle,
	CustomPopupContent,
} from "../../pages/styles/CustomPopup.jsx";

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
				<CustomPopup>
					<CustomPopupHeader>{place.movieTitle}</CustomPopupHeader>
					<CustomPopupBody>
						{place.sceneDesc && (
							<CustomPopupSection>
								<CustomPopupTitle>촬영 장면 설명</CustomPopupTitle>
								<CustomPopupContent>{place.sceneDesc}</CustomPopupContent>
							</CustomPopupSection>
						)}
						<CustomPopupSection>
							<CustomPopupTitle>촬영 장소</CustomPopupTitle>
							<CustomPopupContent>{place.filmingLocation}</CustomPopupContent>
						</CustomPopupSection>
						<CustomPopupSection>
							<CustomPopupTitle>촬영 연도</CustomPopupTitle>
							<CustomPopupContent>{place.productionYear}</CustomPopupContent>
						</CustomPopupSection>
					</CustomPopupBody>
				</CustomPopup>
			</Popup>
		</Marker>
	);
};

export default PlaceMarker;
