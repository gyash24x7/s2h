import type { ComponentProps } from "react";

export type IconType = ( props: ComponentProps<"svg"> ) => JSX.Element;

export type Appearance = "primary" | "default" | "warning" | "danger" | "success" | "info" | "alt"

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export function getIconWidthHeightFromSize( size: Size ) {
	const sizeMap = {
		xs: { width: 10, height: 10 },
		sm: { width: 12, height: 12 },
		md: { width: 14, height: 14 },
		lg: { width: 16, height: 16 },
		xl: { width: 20, height: 20 },
		"2xl": { width: 24, height: 24 }
	};
	return sizeMap[ size ];
}

export function getClassname( baseClass: string, variants: Record<string, string | boolean> ) {
	const classList = [ baseClass ];
	for ( let variant in variants ) {
		const variantValue = variants[ variant ];
		if ( typeof variantValue === "string" ) {
			classList.push( `${ baseClass }--variant-${ variant }-${ variantValue }` );
		}
		if ( typeof variantValue === "boolean" && variantValue ) {
			classList.push( `${ baseClass }--variant-${ variant }` );
		}
	}
	return classList.join( " " );
}

export type TailwindStyles = {
	base: string;
	variants?: Record<string, Record<string, string>>
}

// export function getClassName( styles: TailwindStyles, variants: Record<string, string> = {} ) {
// 	let className = styles.base;
// 	let definedVariants = styles.variants || {};
// 	for ( let variantKey in variants ) {
// 		className += " " + definedVariants[ variantKey ][ variants[ variantKey ] ] || "";
// 	}
// 	return className;
// }