import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./utils/auth";
import { TrpcProvider } from "./utils/trpc";
import { AppRoutes } from "./routes";
import "./styles/globals.css";

function App() {
	return (
		<TrpcProvider>
			<AuthProvider>
				<AppRoutes/>
			</AuthProvider>
		</TrpcProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
	document.getElementById( "root" )
);
