import type { Infer } from "superstruct";
import * as s from "superstruct";

const passwordRegex = new RegExp( "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$" );
const emailRegex = new RegExp( "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" );

export type CreateUserResponse = { message?: string };

export type VerifyUserResponse = { message?: string };

export type LoginResponse = { token?: string };

export const createUserInputStruct = s.object( {
	name: s.nonempty( s.string() ),
	email: s.pattern( s.nonempty( s.string() ), emailRegex ),
	password: s.pattern( s.nonempty( s.string() ), passwordRegex )
} );

export type CreateUserInput = Infer<typeof createUserInputStruct>;

export const loginInputStruct = s.object( {
	email: s.pattern( s.nonempty( s.string() ), emailRegex ),
	password: s.pattern( s.nonempty( s.string() ), passwordRegex )
} );

export type LoginInput = Infer<typeof loginInputStruct>;

export const verifyUserInputStruct = s.object( {
	token: s.nonempty( s.string() )
} );

export type VerifyUserInput = Infer<typeof verifyUserInputStruct>;