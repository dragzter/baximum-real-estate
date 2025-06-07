"use client";

import PageNav from "@/components/page-nav";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { BaxUser } from "@/lib/types";

export default function Deals() {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const getUser = useUserStore((s) => s.getUser);

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

	if (isLoading || !user) {
		return null;
	}

	return (
		<>
			<PageNav />
			<div id="properties-list" className="p-6 flex flex-col h-[calc(100vh-84px)] min-w-[400px]">
				<div className="flex flex-col h-full w-full">Deals table here</div>
			</div>
		</>
	);
}
