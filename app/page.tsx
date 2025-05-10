"use client";

import Dashboard from "@/app/dashboard/page";

export default function Home() {
	// const router = useRouter();
	// const { user, isLoading } = useUser();
	// const setUser = useUserStore((s) => s.setUser);

	// useEffect(() => {
	// 	router.push("/dashboard");
	//
	// 	if (user) {
	// 		// here is where we pass the user
	// 		axios.post("/api/login", { user }).then((resp) => {
	// 			setUser(resp.data.response.data.user);
	//
	// 			router.push("/dashboard");
	// 		});
	// 	}
	// }, [user, isLoading, router]);

	return (
		// <div className="min-h-screen flex items-center justify-center bg-background">
		// 	<div className="w-full max-w-md p-6">
		// 		<Card>
		// 			<CardHeader>
		// 				<div className="flex items-center justify-center mb-6">
		// 					<Image src={'/bax_logo.png'} width={280} height={0} alt={'logo'} />
		// 				</div>
		// 			</CardHeader>
		// 			<CardContent>
		// 				<form className="space-y-4">
		// 					<Button asChild className={'h-14 px-8 text-lg'}>
		// 						<Link
		// 							type="submit"
		// 							href="/api/auth/login"
		// 							prefetch={false}
		// 							replace
		// 							className="w-full"
		// 						>
		// 							<KeyRound /> Sign In
		// 						</Link>
		// 					</Button>
		// 				</form>
		// 			</CardContent>
		// 		</Card>
		// 	</div>
		// </div>

		<>
			<Dashboard />
		</>
	);
}
