import { getClassname, Size } from "../utils";

export interface AvatarProps {
	size?: Size;
	src?: string;
	name?: string;
}

// const avatarRootStyles: TailwindStyles = {
// 	base: "inline-flex rounded-full select-none",
// 	variants: {
// 		size: { xs: "w-6 h-6", sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16", xxl: "w-20 h-20" }
// 	}
// };
//
// const avatarImageStyles: TailwindStyles = {
// 	base: "w-full h-full object-cover rounded-full"
// };
//
// const avatarFallbackStyles = {
// 	base: "w-full h-full flex items-center justify-center font-semibold rounded-full bg-alt-100 text-alt",
// 	variants: {
// 		size: { xs: "text-xs", sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-2xl", xxl: "text-3xl" }
// 	}
// };

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