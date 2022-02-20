import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";

import { Avatar } from "@s2h/ui/avatar";

ReactDOM.render(
	<React.StrictMode>
		<Avatar name={ "Yash Gupta" }/>
	</React.StrictMode>,
	document.getElementById( "root" )
);
