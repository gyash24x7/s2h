const withTM = require( "next-transpile-modules" )( [ "@s2h/ui", "@s2h/routers", "@s2h/utils", "@s2h/dtos" ] );

module.exports = withTM( {
    reactStrictMode: true,
} );
