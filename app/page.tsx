import { ClerkProvider, Waitlist } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <div className="flex h-screen w-screen flex-row items-center justify-between gap-2">
                <Link
                    className="absolute top-4 right-4 rounded-md p-2 px-4 text-gray-700 text-sm transition-all duration-100 hover:bg-gray-100"
                    href="/login"
                >
                    Sign in
                </Link>
                <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2">
                    <div className="flex flex-row items-center justify-center gap-4">
                        <Image
                            alt="karnet"
                            className="select-none rounded-[4px]"
                            height={32}
                            loading="eager"
                            priority
                            src="/new-logo.svg"
                            width={32}
                        />
                        <h1 className="font-bold font-mozilla-headline text-4xl">Karnet</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Your magical notebook</p>
                    <p className="pt-4 text-gray-500">ai powered knowledge and organization tool adapted for you </p>
                </div>
                <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2">
                    <Waitlist signInUrl="/login" />
                </div>
            </div>
        </ClerkProvider>
    );
}
