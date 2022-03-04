const tailwindConfig = require( "@s2h/config/tailwind.json" );
module.exports = {
    ...tailwindConfig,
    content: [
        "./src/**/*.{js,ts,jsx,tsx}"
    ]
}