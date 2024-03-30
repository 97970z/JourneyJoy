// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useAuth } from "./contextAPI/AuthContext";
import { AuthProvider } from "./contextAPI/AuthContext";
import { PlacesProvider } from "./contextAPI/PlacesContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LocationDetail from "./pages/LocationDetail";
import LocationMap from "./pages/LocationMap";
import Navbar from "./components/Navbar/Navbar";
import AdminPanel from "./components/AdminPanel/AdminPanel";

const AppRoutes = () => {
	const { currentUser } = useAuth();

	let routes = [
		{ path: "/", element: <Home /> },
		{ path: "/register", element: <Register /> },
		{ path: "/login", element: <Login /> },
		{ path: "/locations/:id", element: <LocationDetail /> },
		{ path: "/allplaces", element: <LocationMap /> },
	];

	if (currentUser?.role === "admin") {
		routes = [...routes, { path: "/adminpanel", element: <AdminPanel /> }];
	}

	return useRoutes(routes);
};

function App() {
	return (
		<AuthProvider>
			<PlacesProvider>
				<BrowserRouter>
					<Navbar />
					<AppRoutes />
				</BrowserRouter>
			</PlacesProvider>
		</AuthProvider>
	);
}

export default App;
