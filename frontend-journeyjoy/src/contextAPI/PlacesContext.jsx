// src/contextAPI/PlacesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../baseAPI/Api";

const PlacesContext = createContext();

export const usePlaces = () => useContext(PlacesContext);

export const PlacesProvider = ({ children }) => {
	const [places, setPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchPlaces();
	}, []);

	const fetchPlaces = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/places");
			setPlaces(response.data);
		} catch (error) {
			console.error("Failed to fetch places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addPlace = async (formData) => {
		try {
			const response = await api.post("/places/add", formData);
			setPlaces([...places, response.data]);
		} catch (error) {
			console.error("Failed to add location", error);
		}
	};

	const deletePlace = async (id) => {
		try {
			await api.delete(`/places/${id}`);
			setPlaces(places.filter((place) => place._id !== id));
		} catch (error) {
			console.error("Failed to delete location", error);
		}
	};

	const updatePlace = async (id, formData) => {
		try {
			const response = await api.put(`/places/${id}`, formData);
			setPlaces(
				places.map((place) => (place._id === id ? response.data : place)),
			);
		} catch (error) {
			console.error("Failed to update location", error);
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
			}}
		>
			{children}
		</PlacesContext.Provider>
	);
};
