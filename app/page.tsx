"use client";

import { KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGeneralAppStateStore } from "@/lib/store";
import { allWrongMessages } from "@/lib/utils";

export default function Home() {
	const router = useRouter();
	const [passphrase, setPassphrase] = useState("");
	const [password, setPassword] = useState("");
	const [enterCount, setEnterCount] = useState(0);
	const [passwordLoaded, setPasswordLoaded] = useState(false);
	const passphraseRef = useRef("");

	const setIsInvestor = useGeneralAppStateStore((s) => s.setIsInvestor);

	const validateInput = () => {
		const currentPassphrase = passphraseRef.current;
		if (!password) return;

		if (currentPassphrase !== password) {
			setEnterCount((prev) => {
				const nextCount = allWrongMessages[prev] ? prev + 1 : 0;

				toast.error("Incorrect Passphrase!", {
					description: allWrongMessages[nextCount],
				});

				console.log(enterCount);

				return nextCount;
			});
		} else {
			setIsInvestor(true);
			router.push("/dashboard");
		}
	};

	useEffect(() => {
		fetch("/api/credentials")
			.then((res) => res.json())
			.then((data) => {
				setPassword(data.phrase);
				setPasswordLoaded(true);
			});
	}, []);

	useEffect(() => {
		if (!passwordLoaded) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				validateInput();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [passwordLoaded]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="w-full max-w-md p-6">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-center mb-6">
							<Image src={"/Baxter-Logo.png.webp"} width={280} height={0} alt={"logo"} />
						</div>
						<h2 className={"text-2xl font-bold text-center"}>Investor Sign In</h2>
					</CardHeader>
					<CardContent>
						<Input
							className={"mb-3"}
							value={passphrase}
							onChange={(e) => {
								setPassphrase(e.target.value);
								passphraseRef.current = e.target.value; // ✅ keep ref updated
							}}
							type={"password"}
							placeholder={"Enter Passphrase"}
						/>
						<Button
							tabIndex={0}
							role="button"
							style={{ width: "100%", cursor: "pointer" }}
							className={"h-10 px-8 text-lg"}
							onClick={validateInput}
						>
							<KeyRound /> Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
