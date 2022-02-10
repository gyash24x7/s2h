import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import Box from "@s2h/ui/box";

const App = () => {
	return (
		<Box>
			Hello From Box
		</Box>
	);
};


ReactDOM.render( <StrictMode><App/></StrictMode>, document.getElementById( "root" ) );
