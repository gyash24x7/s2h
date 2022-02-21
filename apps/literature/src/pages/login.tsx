import React, { FormEvent, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Stack } from "@s2h/ui/stack";
import { TextInput } from "@s2h/ui/text-input";
import { LockClosedIcon, MailIcon } from "@heroicons/react/solid";
import { Button } from "@s2h/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../utils/trpc";

export function Login() {
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const navigate = useNavigate();

	const { mutateAsync, isLoading } = trpc.useMutation( "login", {
		onSuccess: () => navigate( "/" )
	} );

	async function handleLogin( e: FormEvent ) {
		e.preventDefault();
		await mutateAsync( { email, password } );
	}

	return (
		<Flex>
			<div className={ "flex items-center flex-1 p-20 max-w-lg h-screen" }>
				<div className={ "w-full" }>
					<h1 className={ "font-light text-3xl uppercase my-5" }>Login</h1>
					<form onSubmit={ handleLogin } noValidate>
						<Stack orientation={ "vertical" }>
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
								<p>Don't have an account?</p>
								<Link to="/signup">
									<p className="text-primary">Sign Up</p>
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