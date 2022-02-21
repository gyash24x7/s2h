import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import { TrpcProvider } from "./utils/trpc";
import { Login } from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/signup";
import { VerifyUser } from "./pages/verify-user";
import { Home } from "./pages";
import { LiteratureHome } from "./pages/games/literature";

function App() {
	return (
		<TrpcProvider>
			<BrowserRouter>
				<Routes>
					<Route path={ "/" } element={ <Home/> }/>
					<Route path={ "/login" } element={ <Login/> }/>
					<Route path={ "/signup" } element={ <Signup/> }/>
					<Route path={ "/verify-user" } element={ <VerifyUser/> }/>
					<Route path={ "/games/literature" } element={ <LiteratureHome/> }/>
				</Routes>
			</BrowserRouter>
		</TrpcProvider>
	);
}

ReactDOM.render( <App/>, document.getElementById( "root" ) );
