// src/contextAPI/PlacesContext.jsx
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import Api from "../baseAPI/Api";
import axios from "axios";

const PlacesContext = createContext();

export const usePlaces = () => useContext(PlacesContext);

export const PlacesProvider = ({ children }) => {
	const [userPlaces, setUserPlaces] = useState([]);
	const [movieFilmPlaces, setMovieFilmPlaces] = useState([]);
	const [tvFilmPlaces, setTvFilmPlaces] = useState([]);
	const [festaPlaces, setFestaPlaces] = useState([]);
	const [nationalFestaPlaces, setNationalFestaPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (userPlaces.length === 0) {
			fetchPlaces();
		}
	}, [userPlaces.length]);

	const fetchPlaces = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await Api.get(`/places/status/Approved`);
			setUserPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch places:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getCoordinatesFromAddress = useCallback(async (address) => {
		try {
			const response = await axios.get(
				"https://maps.googleapis.com/maps/api/geocode/json",
				{
					params: {
						address,
						key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
					},
				},
			);

			const { data } = response;
			if (data.status !== "OK" || !data.results || data.results.length === 0) {
				throw new Error("No location found for the provided address.");
			}

			const { lat, lng } = data.results[0].geometry.location;
			return { lat, lng };
		} catch (error) {
			console.error("Failed to get coordinates from address:", error);
			return { lat: 0, lng: 0 };
		}
	}, []);

	const addPlace = useCallback(async (formData) => {
		try {
			const response = await Api.post("/places/add", formData);
			const newPlace = response.data;
			setUserPlaces((prevPlaces) => [...prevPlaces, newPlace]);
			return newPlace._id;
		} catch (error) {
			console.error("Failed to add location", error);
		}
	}, []);

	const deletePlace = useCallback(async (id) => {
		try {
			await Api.delete(`/places/${id}`);
			setUserPlaces((prevPlaces) =>
				prevPlaces.filter((place) => place._id !== id),
			);
		} catch (error) {
			console.error("Failed to delete location", error);
		}
	}, []);

	const updatePlace = useCallback(async (id, formData) => {
		try {
			const response = await Api.put(`/places/${id}`, formData);
			setUserPlaces((prevPlaces) =>
				prevPlaces.map((place) => (place._id === id ? response.data : place)),
			);
		} catch (error) {
			console.error("Failed to update location", error);
		}
	}, []);

	const fetchMovieFilmPlaces = useCallback(async () => {
		if (movieFilmPlaces.length > 0) return;

		setIsLoading(true);
		try {
			const response = await Api.get("/places/movieFilmPlaces");
			setMovieFilmPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch external places:", error);
		} finally {
			setIsLoading(false);
		}
	}, [movieFilmPlaces.length]);

	const fetchTvFilmPlaces = useCallback(async () => {
		if (tvFilmPlaces.length > 0) return;

		setIsLoading(true);
		try {
			const response = await Api.get("/places/tvFilmPlaces");
			setTvFilmPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch external places:", error);
		} finally {
			setIsLoading(false);
		}
	}, [tvFilmPlaces.length]);

	const fetchFestaPlaces = useCallback(async () => {
		if (festaPlaces.length > 0) return;

		setIsLoading(true);
		try {
			const response = await Api.get("/places/festivals");
			setFestaPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch festival places:", error);
		} finally {
			setIsLoading(false);
		}
	}, [festaPlaces.length]);

	const fetchNationalFestaPlaces = useCallback(async () => {
		if (nationalFestaPlaces.length > 0) return;

		setIsLoading(true);
		try {
			const response = await Api.get("/places/nationalFestivals");
			setNationalFestaPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch national festival places:", error);
		} finally {
			setIsLoading(false);
		}
	}, [nationalFestaPlaces.length]);

	return (
		<PlacesContext.Provider
			value={{
				userPlaces,
				movieFilmPlaces,
				tvFilmPlaces,
				festaPlaces,
				nationalFestaPlaces,
				isLoading,
				addPlace,
				deletePlace,
				updatePlace,
				fetchPlaces,
				fetchMovieFilmPlaces,
				fetchTvFilmPlaces,
				fetchFestaPlaces,
				fetchNationalFestaPlaces,
				getCoordinatesFromAddress,
			}}
		>
			{children}
		</PlacesContext.Provider>
	);
};
