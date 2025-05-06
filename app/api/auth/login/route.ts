// app/api/auth/login/route.ts
import { handleLogin } from '@auth0/nextjs-auth0';

const handler = handleLogin({
	authorizationParams: {
		prompt: 'login',
	},
});

// Force-cast to App Router type
export const GET = handler as unknown as (req: Request) => Response | Promise<Response>;
