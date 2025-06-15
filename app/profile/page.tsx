"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useGeneralAppStateStore, useUserStore } from "@/lib/store";
import { useEffect } from "react";
import { BaxUser } from "@/lib/types";

export default function Profile() {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const getUser = useUserStore((s) => s.getUser);
	const isInvestor = useGeneralAppStateStore((s) => s.investor);

	useEffect(() => {
		if (!isLoading) {
			if (user?.sub) {
				(async () => {
					await getUser(user as unknown as BaxUser);
				})();
			} else {
				router.push("/");
			}
		}
	}, [user, getUser, isLoading, router]);

	if (isLoading || !user || !isInvestor) {
		return null;
	}
	return "Profile page";
}
