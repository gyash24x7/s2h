import { getClassname, Size } from "../utils";

export interface AvatarProps {
	size?: Size;
	src?: string | null;
	name?: string | null;
}

const randomChar = () => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return possible.charAt( Math.floor( Math.random() * 26 ) );
};

const initialsFromName = ( name: string ) => {
	const words = name.trim().split( " " );
	if ( words.length > 1 ) {
		const initials = words[ 0 ].charAt( 0 ) + words[ 1 ].charAt( 0 );
		return initials.toUpperCase();
	} else if ( words.length === 1 ) {
		if ( words[ 0 ].length > 1 ) {
			const initials = words[ 0 ].charAt( 0 ) + words[ 0 ].charAt( 1 );
			return initials.toUpperCase();
		} else {
			const initials = words[ 0 ].charAt( 0 ) + randomChar();
			return initials.toUpperCase();
		}
	} else {
		const initials = randomChar() + randomChar();
		return initials.toUpperCase();
	}
};

export function Avatar( props: AvatarProps ) {
	return (
		<div className={ getClassname( "avatar-root", { size: props.size || "md" } ) }>
			{ !!props.src && <img src={ props.src } alt={ "avatar" }/> }
			{ !props.src && <div>{ initialsFromName( props.name || "" ) }</div> }
		</div>
	);
}