const tailwindcss = require( "tailwindcss" );
const autoprefixer = require( "autoprefixer" );
const tailwindcssNesting = require( "tailwindcss/nesting" );
const postcssImport = require( "postcss-import" );

module.exports = {
    plugins: [
        postcssImport(),
        tailwindcssNesting(),
        tailwindcss(),
        autoprefixer()
    ]
};