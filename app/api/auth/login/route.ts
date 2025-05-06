import { handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleLogin({
	authorizationParams: {
		prompt: 'login',
	},
});
