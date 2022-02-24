/** @type {import('next').NextConfig} */
const withTM = require( "next-transpile-modules" )( [ "@s2h/ui" ] );

module.exports = withTM( {
    reactStrictMode: true,
} );
