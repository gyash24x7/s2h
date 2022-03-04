import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../utils/auth";
import HomePage from "../pages/home";
import PlayPage from "../pages/play";

export function AppRoutes() {
	const { user } = useAuth();

	return (
		<BrowserRouter>
			<Routes>
				<Route path={ "/" } element={ <HomePage/> }/>
				{ !!user && <Route path={ "/play/:gameId" } element={ <PlayPage/> }/> }
			</Routes>
		</BrowserRouter>
	);
}