// frontend/src/components/LocationMap/PlaceMap.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import {
	Map,
	MapMarker,
	MarkerClusterer,
	MapTypeControl,
	ZoomControl,
} from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";
import { Tabs, Tab, Box } from "@mui/material";
import InfoWindow_MovieFilm from "./InfoWindow_MovieFilm";
import InfoWindow_Festa from "./InfoWindow_Festa";
import InfoWindow_TvFilm from "./InfoWindow_TvFilm";
import debounce from "lodash.debounce";

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

	const handleMarkerClick = useMemo(
		() =>
			debounce((clickedPlace) => {
				const latitude =
					clickedPlace.LOT || clickedPlace.lat || clickedPlace.LC_LA;
				const longitude =
					clickedPlace.LAT || clickedPlace.lng || clickedPlace.LC_LO;

				setMarkerClickCenter({ lat: latitude, lng: longitude });

				const similarPlaces = places.filter(
					(place) =>
						(place.LOT || place.lat || place.LC_LA) === latitude &&
						(place.LAT || place.lng || place.LC_LO) === longitude,
				);
				setActivePlaces(similarPlaces);
				setSelectedTab(0);
			}, 300),
		[places],
	);

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const filteredPlaces = useMemo(
		() =>
			places.filter(
				(place) => place.CODENAME || place.MEDIA_TY || place.sceneDesc,
			),
		[places],
	);

	return (
		<Map
			center={markerClickCenter}
			style={{ width: "100%", height: "80vh" }}
			level={8}
			onCreate={(map) => (mapRef.current = map)}
		>
			<MapTypeControl position={"TOPRIGHT"} />
			<ZoomControl position={"RIGHT"} />
			<MarkerClusterer averageCenter={true} minLevel={6}>
				{filteredPlaces.map((place, index) => (
					<MapMarker
						key={index}
						position={{
							lat: place.LOT || place.lat || place.LC_LA,
							lng: place.LAT || place.lng || place.LC_LO,
						}}
						clickable={true}
						image={{
							src: place.lat
								? "https://res.cloudinary.com/dl6f9clxo/image/upload/v1714042563/journeyjoy/fvr0adrlhcur7wwpaw1e.png"
								: place.LC_LA
									? "https://res.cloudinary.com/dl6f9clxo/image/upload/v1716369886/journeyjoy/jwpr4ls0tx8gjcasrymg.png"
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
								label={
									place.TITLE
										? place.TITLE
										: place.movieTitle
											? place.movieTitle
											: place.TITLE_NM
								}
								key={index}
							/>
						))}
					</Tabs>
					{activePlaces.map((place, index) => (
						<div role="tabpanel" hidden={selectedTab !== index} key={index}>
							{place.CODENAME ? (
								<InfoWindow_Festa festival={place} />
							) : place.movieTitle ? (
								<InfoWindow_MovieFilm place={place} />
							) : (
								<InfoWindow_TvFilm tvFilm={place} />
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
