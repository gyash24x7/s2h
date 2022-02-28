import { Avatar } from "@s2h/ui/avatar";
import { Stack } from "@s2h/ui/stack";
import type { Session } from "next-auth";


export interface UserCardProps {
	user: Session["user"];
}

export function UserCard( { user }: UserCardProps ) {
	return (
		<div className={ "bg-light-100 rounded-md p-5 w-full mb-4" }>
			<Stack centered align={ "center" }>
				<Avatar name={ user?.name } src={ user?.image }/>
				<div>
					<p className={ "text-base" }>{ user?.name?.toUpperCase() }</p>
					<p className={ "text-sm text-dark-100" }>{ user?.email?.toLowerCase() }</p>
				</div>
			</Stack>
		</div>
	);
}