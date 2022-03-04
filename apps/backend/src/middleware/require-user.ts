import type { ExpressMiddleware } from "@s2h/utils";

const requireUser: ExpressMiddleware = function ( _req, res, next ) {
	if ( !res.locals.userId ) {
		return res.sendStatus( 403 );
	} else {
		return next();
	}
};

export default requireUser;