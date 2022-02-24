const tailwindConfig = require( "@s2h/config/tailwind.json" );

module.exports = {
    ...tailwindConfig,
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ]
}
