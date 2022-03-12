import { Appearance, getClassname, IconType } from "../utils";
import { HStack } from "../stack";
import { Spinner } from "../spinner";

export interface BannerProps {
	appearance?: Appearance;
	icon?: IconType;
	message: string;
	isLoading?: boolean;
	centered?: boolean;
}

export function Banner( { appearance = "default", isLoading, icon: Icon, message, centered = false }: BannerProps ) {
	return (
		<div className={ getClassname( "banner-root", { appearance } ) }>
			<HStack centered={ centered }>
				{ isLoading && (
					<Spinner
						size={ "sm" }
						appearance={ appearance === "warning" || appearance === "default" ? "dark" : "default" }
					/>
				) }
				{ Icon && !isLoading && <Icon width={ 20 } height={ 20 }/> }
				<h2>{ message }</h2>
			</HStack>
		</div>
	);
}