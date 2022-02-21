import React, { FormEvent, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Stack } from "@s2h/ui/stack";
import { TextInput } from "@s2h/ui/text-input";
import { Button } from "@s2h/ui/button";
import { trpc } from "../utils/trpc";
import { Link, useNavigate } from "react-router-dom";
import { LockClosedIcon, MailIcon, UserIcon } from "@heroicons/react/solid";

export function Signup() {
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const navigate = useNavigate();

	const { mutateAsync, isLoading } = trpc.useMutation( [ "create-user" ], {
		async onSuccess() {
			await navigate( "/login" );
		},
		async onError( error ) {
			console.log( error.message );
		}
	} );

	async function handleSignUp( e: FormEvent ) {
		e.preventDefault();
		await mutateAsync( { email, password, name } );
	}

	return (
		<Flex>
			<div className={ "flex items-center flex-1 p-20 max-w-lg h-screen" }>
				<div className={ "w-full" }>
					<h1 className={ "font-light text-3xl uppercase my-5" }>Sign Up</h1>
					<form onSubmit={ handleSignUp } noValidate>
						<Stack orientation={ "vertical" }>
							<TextInput
								name={ "name" }
								label={ "Name" }
								value={ name }
								onChange={ setName }
								iconBefore={ UserIcon }
							/>
							<TextInput
								name={ "email" }
								label={ "Email" }
								type={ "email" }
								iconBefore={ MailIcon }
								value={ email }
								onChange={ setEmail }
							/>
							<TextInput
								name={ "password" }
								label={ "Password" }
								type={ "password" }
								iconBefore={ LockClosedIcon }
								value={ password }
								onChange={ setPassword }
							/>
							<Button
								type="submit"
								fullWidth
								appearance={ "primary" }
								isLoading={ isLoading }
								buttonText={ "Submit" }
							/>
							<Flex justify={ "space-between" } expand>
								<p>Already have an account?</p>
								<Link to="/login">
									<p className="text-primary">Login</p>
								</Link>
							</Flex>
						</Stack>
					</form>
				</div>
			</div>
			<div className="flex-1 h-screen literature-bg from-dark to-primary"/>
		</Flex>
	);
}