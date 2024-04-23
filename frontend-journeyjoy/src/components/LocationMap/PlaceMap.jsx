// frontend/src/components/LocationMap/PlaceMap.jsx
import { useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";
import {
	CustomPopupHeader,
	CustomPopupBody,
	CustomPopupSection,
	CustomPopupTitle,
	CustomPopupContent,
} from "../../pages/styles/CustomPopup.jsx";

const PlaceMap = ({ places, center }) => {
	useKakaoLoader();

	const [activeMarker, setActiveMarker] = useState(null);

	const handleMarkerClick = (place) => {
		if (activeMarker && activeMarker.id === place.id) {
			setActiveMarker(null);
		} else {
			setActiveMarker(place);
		}
	};

	return (
		<Map
			center={{ lat: center.lat, lng: center.lng }}
			style={{ width: "100%", height: "70vh" }}
			level={12}
		>
			<MarkerClusterer>
				{places.map((place) => (
					<MapMarker
						key={place.id}
						position={{ lat: place.lat, lng: place.lng }}
						clickable={true}
						image={{
							src: "https://res.cloudinary.com/dl6f9clxo/image/upload/v1711023540/journeyjoy/rc5rmev7gsotxieckjp9.svg",
							size: { width: 30, height: 30 },
							options: { offset: { x: 18, y: 48 } },
						}}
						onClick={() => handleMarkerClick(place)}
					>
						{activeMarker && activeMarker.id === place.id && (
							<div
								style={{ minWidth: "150px", maxWidth: "350px", top: "-10px" }}
							>
								<img
									alt="close"
									width="14"
									height="13"
									src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
									style={{
										position: "absolute",
										right: "5px",
										top: "5px",
										cursor: "pointer",
									}}
									onClick={() => setActiveMarker(null)}
								/>
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
										<CustomPopupContent>
											{place.filmingLocation}
										</CustomPopupContent>
									</CustomPopupSection>
									<CustomPopupSection>
										<CustomPopupTitle>촬영 연도</CustomPopupTitle>
										<CustomPopupContent>
											{place.productionYear}
										</CustomPopupContent>
									</CustomPopupSection>
								</CustomPopupBody>
							</div>
						)}
					</MapMarker>
				))}
			</MarkerClusterer>
		</Map>
	);
};

export default PlaceMap;
