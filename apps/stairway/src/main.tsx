import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider, Text } from "@mantine/core"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { lightTheme } from "./theme";
import { NavbarMinimal } from "./components/navbar";
import { useColorScheme } from "@mantine/hooks";

function App() {
    const preferredColorScheme = useColorScheme();
    const [ colorScheme, setColorScheme ] = useState<ColorScheme>( preferredColorScheme );
    const toggleColorScheme = ( value?: ColorScheme ) => {
        const scheme = colorScheme === "dark" ? "light" : "dark";
        setColorScheme( value || scheme );
    }

    return (
        <ColorSchemeProvider colorScheme = { colorScheme } toggleColorScheme = { toggleColorScheme }>
            <MantineProvider theme = { lightTheme } withNormalizeCSS>
                <AppShell navbar = { <NavbarMinimal /> }>
                    <Text size = { "xl" } weight = { 600 } color = { "primary" }>
                        Hello World
                    </Text>
                </AppShell>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById( "root" )
)
