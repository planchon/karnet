"use client";

import { useUser } from "@clerk/nextjs";
import { Input } from "@ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
	const { isSignedIn } = useUser();

	if (isSignedIn) {
		redirect("/document");
	}

	return (
		<div className="flex h-screen gap-6 w-screen flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-4xl font-bold">Karnet</h2>
				<h2 className="text-xl font-medium">your magical notebook</h2>
			</div>
			<div className="absolute bottom-4 gap-4 flex flex-col items-start">
				<div>
					<h2 className="text-sm font-medium">Private Alpha</h2>
					<p className="text-sm text-muted-foreground">
						enter your email to get early access
					</p>
				</div>
				<Input className="w-96" placeholder="Enter your email" />
			</div>
			<Link href="/login" className="absolute top-4 right-4">
				<button
					type="button"
					className="hover:cursor-pointer rounded-full bg-[#131316] px-4 py-2 text-sm font-semibold text-white"
				>
					Sign in
				</button>
			</Link>
		</div>
	);
}
