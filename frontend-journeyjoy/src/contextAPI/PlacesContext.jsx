// src/contextAPI/PlacesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { xml2js } from "xml-js";
import Api from "../baseAPI/Api";

const PlacesContext = createContext();

export const usePlaces = () => useContext(PlacesContext);

export const PlacesProvider = ({ children }) => {
	const [places, setPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchPlaces();
		fetchExternalPlaces();
	}, []);

	const fetchPlaces = async () => {
		setIsLoading(true);
		try {
			const response = await Api.get("/places");
			setPlaces(response.data);
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

			setPlaces([...places, newPlace]);
			return newPlace._id;
		} catch (error) {
			console.error("Failed to add location", error);
		}
	};

	const deletePlace = async (id) => {
		try {
			await Api.delete(`/places/${id}`);
			setPlaces(places.filter((place) => place._id !== id));
		} catch (error) {
			console.error("Failed to delete location", error);
		}
	};

	const updatePlace = async (id, formData) => {
		try {
			const response = await Api.put(`/places/${id}`, formData);
			setPlaces(
				places.map((place) => (place._id === id ? response.data : place)),
			);
		} catch (error) {
			console.error("Failed to update location", error);
		}
	};

	const fetchExternalPlaces = async () => {
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
			const items = result.response.item;

			return items.map((item) => ({
				id: item.filmingSeq._text,
				movieTitle: item.movieTitle._text,
				filmingLocation: item.filmingLocation._text,
				productionYear: item.productionYear._text,
				sceneDesc: item.sceneDesc?._text ?? "장면 설명 없음!",
				sido: item.sido._text,
				lat: parseFloat(item.latitude._text),
				lng: parseFloat(item.longitude._text),
			}));
		} catch (error) {
			console.error("Failed to fetch external places:", error);
			return [];
		}
	};

	return (
		<PlacesContext.Provider
			value={{
				places,
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
