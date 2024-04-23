// frontend/src/components/LocationMap/PlaceMap.jsx
import { useEffect, useState, useRef } from "react";
import {
	Map,
	MapMarker,
	MarkerClusterer,
	MapTypeControl,
	ZoomControl,
} from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";
import {
	CustomPopupHeader,
	CustomPopupBody,
	CustomPopupSection,
	CustomPopupTitle,
	CustomPopupContent,
} from "../../pages/styles/CustomPopup.jsx";
import Carousel from "react-material-ui-carousel";

const PlaceMap = ({ places, center }) => {
	useKakaoLoader();
	const [activePlaces, setActivePlaces] = useState([]);
	const mapRef = useRef(null);

	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.setCenter(
				new window.kakao.maps.LatLng(center.lat, center.lng),
			);
		}
	}, [center]);

	const handleMarkerClick = (clickedPlace) => {
		const similarPlaces = places.filter(
			(place) =>
				place.lat === clickedPlace.lat && place.lng === clickedPlace.lng,
		);
		setActivePlaces(similarPlaces);
	};

	return (
		<Map
			center={{ lat: 37.5665, lng: 126.978 }}
			style={{ width: "100%", height: "70vh" }}
			level={10}
			onCreate={(map) => (mapRef.current = map)}
		>
			<MapTypeControl position={"TOPRIGHT"} />
			<ZoomControl position={"RIGHT"} />
			<MarkerClusterer averageCenter={true} minLevel={4}>
				{places.map((place) => (
					<MapMarker
						key={place.id}
						position={{ lat: place.lat, lng: place.lng }}
						clickable={true}
						image={{
							src: "https://res.cloudinary.com/dl6f9clxo/image/upload/v1711023540/journeyjoy/rc5rmev7gsotxieckjp9.svg",
							size: { width: 30, height: 30 },
						}}
						onClick={() => handleMarkerClick(place)}
					>
						{activePlaces.some(
							(activePlace) => activePlace.id === place.id,
						) && (
							<div
								style={{
									minWidth: "250px",
									maxWidth: "300px",
									position: "absolute",
									top: "-10px",
									backgroundColor: "#fff",
									borderRadius: "10px",
									boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
									height: "370px",
									overflow: "auto",
								}}
							>
								<Carousel
									autoPlay={false}
									animation="slide"
									navButtonsWrapperProps={{
										style: {
											top: "50%",
											transform: "translateY(-50%)",
										},
									}}
								>
									{activePlaces.map((item, index) => (
										<div key={index}>
											<CustomPopupHeader>{item.movieTitle}</CustomPopupHeader>
											<CustomPopupBody>
												{item.sceneDesc && (
													<CustomPopupSection>
														<CustomPopupTitle>촬영 장면 설명</CustomPopupTitle>
														<CustomPopupContent>
															{item.sceneDesc}
														</CustomPopupContent>
													</CustomPopupSection>
												)}
												<CustomPopupSection>
													<CustomPopupTitle>촬영 장소</CustomPopupTitle>
													<CustomPopupContent>
														{item.filmingLocation}
													</CustomPopupContent>
												</CustomPopupSection>
												<CustomPopupSection>
													<CustomPopupTitle>촬영 연도</CustomPopupTitle>
													<CustomPopupContent>
														{item.productionYear}
													</CustomPopupContent>
												</CustomPopupSection>
											</CustomPopupBody>
										</div>
									))}
								</Carousel>
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
										zIndex: 1,
									}}
									onClick={() => setActivePlaces([])}
								/>
							</div>
						)}
					</MapMarker>
				))}
			</MarkerClusterer>
		</Map>
	);
};

export default PlaceMap;
