// src/contextAPI/PlacesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { xml2js } from "xml-js";
import Api from "../baseAPI/Api";

const PlacesContext = createContext();

export const usePlaces = () => useContext(PlacesContext);

export const PlacesProvider = ({ children }) => {
	const [userPlaces, setUserPlaces] = useState([]);
	const [apiPlaces, setApiPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchPlaces();
		fetchExternalPlaces();
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
		const cachedPlaces = localStorage.getItem("cachedExternalPlaces");
		if (cachedPlaces) {
			const parsedCachedPlaces = JSON.parse(cachedPlaces);

			setApiPlaces(parsedCachedPlaces);
			setIsLoading(false);
		} else {
			try {
				const response = await axios.get(
					"https://apis.data.go.kr/B551010/locfilming/locfilmingList",
					{
						params: {
							serviceKey: import.meta.env.VITE_OPEN_API_SERVICE_KEY,
							pageNo: 1,
							numOfRows: 20000,
						},
					},
				);
				const result = xml2js(response.data, { compact: true, spaces: 4 });

				let items = result.response?.item ?? [];

				if (!Array.isArray(items)) items = [items];

				const formattedPlaces = items.map((item) => ({
					id: item.filmingSeq._text,
					movieTitle: item.movieTitle._text,
					filmingLocation: item.filmingLocation._text,
					productionYear: item.productionYear?._text ?? "N/A",
					sceneDesc: item.sceneDesc?._text ?? "No description",
					sido: item.sido._text,
					lat: parseFloat(item.latitude._text),
					lng: parseFloat(item.longitude._text),
				}));

				localStorage.setItem(
					"cachedExternalPlaces",
					JSON.stringify(formattedPlaces),
				);

				setApiPlaces(formattedPlaces);
			} catch (error) {
				console.error("Failed to fetch external places:", error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<PlacesContext.Provider
			value={{
				userPlaces,
				apiPlaces,
				isLoading,
				addPlace,
				deletePlace,
				updatePlace,
				fetchPlaces,
				fetchExternalPlaces,
			}}
		>
			{children}
		</PlacesContext.Provider>
	);
};
