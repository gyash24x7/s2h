import { Appearance, getClassname, IconType } from "../utils";
import { HStack } from "../stack";
import { Spinner } from "../spinner";

export interface BannerProps {
	className?: string;
	appearance?: Appearance;
	icon?: IconType;
	message: string;
	isLoading?: boolean;
	centered?: boolean;
}

export function Banner( props: BannerProps ) {
	const { appearance = "default", isLoading, icon: Icon, message, centered = false, className } = props;
	return (
		<div className={ `${ getClassname( "banner-root", { appearance } ) } ${ className }` }>
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