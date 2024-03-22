// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextAPI/AuthContext";
import { PlacesProvider } from "./contextAPI/PlacesContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LocationDetail from "./pages/LocationDetail";
import LocationMap from "./pages/LocationMap";
import Navbar from "./components/Navbar/Navbar";

function App() {
	return (
		<AuthProvider>
			<PlacesProvider>
				<BrowserRouter>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/locations/:id" element={<LocationDetail />} />
						<Route path="/allplaces" element={<LocationMap />} />
					</Routes>
				</BrowserRouter>
			</PlacesProvider>
		</AuthProvider>
	);
}

export default App;
