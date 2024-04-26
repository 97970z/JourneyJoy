// src/contextAPI/PlacesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import Api from "../baseAPI/Api";
import axios from "axios";

const PlacesContext = createContext();

export const usePlaces = () => useContext(PlacesContext);

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_API_URL = "https://dapi.kakao.com/v2/local/search/address.json";

export const PlacesProvider = ({ children }) => {
	const [userPlaces, setUserPlaces] = useState([]);
	const [apiPlaces, setApiPlaces] = useState([]);
	const [festaPlaces, setFestaPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchPlaces();
	}, []);

	const fetchPlaces = async () => {
		setIsLoading(true);
		try {
			const status = "Approved";
			const response = await Api.get(`/places/status/${status}`);
			setUserPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getCoordinatesFromAddress = async (address) => {
		try {
			const response = await axios.get(KAKAO_API_URL, {
				headers: {
					Authorization: `KakaoAK ${KAKAO_API_KEY}`,
				},
				params: {
					query: address,
				},
			});
			const { documents } = response.data;
			if (documents.length === 0) {
				throw new Error("No location found for the provided address.");
			}
			const { x: lng, y: lat } = documents[0];
			return { lat, lng };
		} catch (error) {
			console.error("Failed to get coordinates from address:", error);
			return { lat: 0, lng: 0 };
		}
	};

	const addPlace = async (formData) => {
		try {
			const response = await Api.post("/places/add", formData);
			const newPlace = response.data;

			setUserPlaces([...userPlaces, newPlace]);
			return newPlace._id;
		} catch (error) {
			console.error("Failed to add location", error);
		}
	};

	const deletePlace = async (id) => {
		try {
			await Api.delete(`/places/${id}`);
			setUserPlaces(userPlaces.filter((place) => place._id !== id));
		} catch (error) {
			console.error("Failed to delete location", error);
		}
	};

	const updatePlace = async (id, formData) => {
		try {
			const response = await Api.put(`/places/${id}`, formData);
			setUserPlaces(
				userPlaces.map((place) => (place._id === id ? response.data : place)),
			);
		} catch (error) {
			console.error("Failed to update location", error);
		}
	};

	const fetchExternalPlaces = async () => {
		setIsLoading(true);
		try {
			const response = await Api.get("/places/external-places");
			setApiPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch external places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchExternalPlaces_Festa = async () => {
		setIsLoading(true);
		try {
			const response = await Api.get("/places/festivals");
			setFestaPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch festival places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PlacesContext.Provider
			value={{
				userPlaces,
				apiPlaces,
				festaPlaces,
				isLoading,
				addPlace,
				deletePlace,
				updatePlace,
				fetchPlaces,
				fetchExternalPlaces,
				fetchExternalPlaces_Festa,
				getCoordinatesFromAddress,
			}}
		>
			{children}
		</PlacesContext.Provider>
	);
};
