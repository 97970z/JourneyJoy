// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useAuth } from "./contextAPI/AuthContext";
import { AuthProvider } from "./contextAPI/AuthContext";
import { PlacesProvider } from "./contextAPI/PlacesContext";
import { ToggleManagementProvider } from "./contextAPI/ToggleManagementContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LocationDetail from "./pages/LocationDetail";
import LocationMap from "./pages/LocationMap";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar/Navbar";

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
				<ToggleManagementProvider>
					<BrowserRouter>
						<Navbar />
						<AppRoutes />
					</BrowserRouter>
				</ToggleManagementProvider>
			</PlacesProvider>
		</AuthProvider>
	);
}

export default App;
