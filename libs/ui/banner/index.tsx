import { Appearance, getClassname, IconType } from "../utils";
import { Stack } from "../stack";
import { Spinner } from "../spinner";

export interface BannerProps {
	appearance?: Appearance;
	icon?: IconType;
	message: string;
	isLoading?: boolean;
}

export function Banner( props: BannerProps ) {
	return (
		<Stack
			align={ "center" }
			className={ getClassname( "banner-root", { appearance: props.appearance || "default" } ) }
		>
			{ props.isLoading && (
				<Spinner
					size={ "sm" }
					appearance={ props.appearance === "warning" || props.appearance === "default" ? "dark" : "default" }
				/>
			) }
			{ props.icon && !props.isLoading && <props.icon width={ 20 } height={ 20 }/> }
			<h2>{ props.message }</h2>
		</Stack>
	);
}