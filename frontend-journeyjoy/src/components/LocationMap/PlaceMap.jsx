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
import { Tabs, Tab, Box } from "@mui/material";
import CustomInfoWindow from "./CustomInfoWindow";
import FestivalInfoWindow from "./FestivalInfoWindow";

const PlaceMap = ({ places, center }) => {
	useKakaoLoader();
	const [activePlaces, setActivePlaces] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [markerClickCenter, setMarkerClickCenter] = useState(center);
	const mapRef = useRef(null);

	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.setCenter(
				new window.kakao.maps.LatLng(center.lat, center.lng),
			);
		}
	}, [center]);

	const handleMarkerClick = (clickedPlace) => {
		const latitude = clickedPlace.LOT || clickedPlace.lat;
		const longitude = clickedPlace.LAT || clickedPlace.lng;

		setMarkerClickCenter({ lat: latitude, lng: longitude });

		const similarPlaces = places.filter(
			(place) =>
				(place.LOT || place.lat) === latitude &&
				(place.LAT || place.lng) === longitude,
		);
		setActivePlaces(similarPlaces);
		setSelectedTab(0);
	};

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	return (
		<Map
			center={markerClickCenter}
			style={{ width: "100%", height: "80vh" }}
			level={10}
			onCreate={(map) => (mapRef.current = map)}
		>
			<MapTypeControl position={"TOPRIGHT"} />
			<ZoomControl position={"RIGHT"} />
			<MarkerClusterer averageCenter={true} minLevel={6}>
				{places
					.filter(
						(place) =>
							place.CODENAME ||
							(place.sceneDesc && place.sceneDesc.trim() !== ""),
					)
					.map((place, index) => (
						<MapMarker
							key={index}
							position={{
								lat: place.LOT || place.lat,
								lng: place.LAT || place.lng,
							}}
							clickable={true}
							image={{
								src: place.lat
									? "https://res.cloudinary.com/dl6f9clxo/image/upload/v1714042563/journeyjoy/fvr0adrlhcur7wwpaw1e.png"
									: "https://res.cloudinary.com/dl6f9clxo/image/upload/v1714042433/journeyjoy/icuhyp81qygkbeu2dwj7.png",
								size: { width: 30, height: 30 },
							}}
							onClick={() => handleMarkerClick(place)}
						/>
					))}
			</MarkerClusterer>
			{activePlaces.length > 0 && (
				<Box
					sx={{
						position: "absolute",
						bottom: 10,
						left: 10,
						width: "50%",
						padding: 1,
						backgroundColor: "white",
						borderRadius: 1,
						zIndex: 1,
						overflow: "auto",
					}}
				>
					<Tabs
						value={selectedTab}
						onChange={handleChange}
						aria-label="Location details"
						variant="scrollable"
						scrollButtons="auto"
					>
						{activePlaces.map((place, index) => (
							<Tab
								label={place.TITLE ? place.TITLE : place.movieTitle}
								key={index}
							/>
						))}
					</Tabs>
					{activePlaces.map((place, index) => (
						<div role="tabpanel" hidden={selectedTab !== index} key={index}>
							{place.CODENAME ? (
								<FestivalInfoWindow festival={place} />
							) : (
								<CustomInfoWindow place={place} />
							)}
						</div>
					))}
					<img
						alt="close"
						width="20"
						height="20"
						src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
						style={{
							position: "absolute",
							right: "0px",
							top: "0px",
							cursor: "pointer",
							zIndex: 1,
						}}
						onClick={() => setActivePlaces([])}
					/>
				</Box>
			)}
		</Map>
	);
};

export default PlaceMap;
