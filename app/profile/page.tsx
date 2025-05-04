'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Profile() {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const getUser = useUserStore((s) => s.getUser);

	useEffect(() => {
		if (!isLoading) {
			if (user?.sub) {
				(async () => {
					await getUser(encodeURIComponent(user.sub as string));
				})();
			} else {
				router.push('/');
			}
		}
	}, [user, getUser, isLoading, router]);

	if (isLoading || !user) {
		return null;
	}
	return 'Profile page';
}
