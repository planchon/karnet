import { IconBrandGithub } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-between gap-2 overflow-x-hidden">
            <div className="fixed top-0 flex h-[50px] w-full border-border border-b bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto flex h-full flex-row items-center justify-between max-lg:px-4">
                    <div className="flex h-full flex-row items-center gap-2">
                        <Image
                            alt="karnet"
                            className="select-none rounded-[4px]"
                            height={20}
                            loading="eager"
                            priority
                            src="/new-logo.svg"
                            width={20}
                        />
                        <h1 className="font-bold font-mozilla-headline text-xl">Karnet</h1>
                    </div>
                    <div className="flex h-full flex-row items-center gap-2">
                        <Link
                            className="rounded-md p-2 px-4 text-gray-700 text-sm transition-all duration-100 hover:bg-gray-100"
                            href="/login"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="h-full w-full pt-36 max-lg:pt-24">
                <div className="container mx-auto max-lg:px-4">
                    <h1 className="max-w-[1000px] font-semibold text-6xl max-lg:text-3xl">
                        The best open source LLM multi-model/modal chat.
                    </h1>
                    <h3 className="max-w-[500px] pt-4 text-gray-500 text-lg">
                        Access all the latest AI models on a beautiful and responsive interface. Use keyboard shortcuts
                        to navigate and chat. Blazing fast and responsive.
                    </h3>
                    <div className="flex flex-row gap-2 pt-4">
                        <Link
                            className="flex flex-row items-center gap-2 rounded-md bg-accent-foreground p-2 px-4 text-accent text-sm transition-all duration-100"
                            href="https://github.com/planchon/karnet"
                            target="_blank"
                        >
                            <IconBrandGithub className="size-4" />
                            Browse the code
                        </Link>
                        <Link
                            className="rounded-md border border-border p-2 px-4 text-sm transition-all duration-100 hover:bg-gray-100"
                            href="/waitlist"
                        >
                            Join waitlist
                        </Link>
                    </div>
                </div>
                <div className="container mx-auto pt-16 max-lg:px-4 max-lg:pt-8">
                    <div>
                        <Image
                            alt="karnet"
                            className="mx-auto rounded-md border border-border"
                            height={1280}
                            src="/hero.png"
                            width={1280}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-16 pt-24">
                    <div className="container mx-auto flex w-full flex-row gap-4 max-lg:px-4">
                        <div className="max-w-1/2">
                            <h1 className="font-bold text-2xl">Best chat</h1>
                            <p className="text-gray-500">
                                Use all the latest AI models with a keyboard first experience. Blazing fast and
                                responsive.
                            </p>
                        </div>
                        <Image alt="karnet" className="mx-auto rounded-md" height={500} src="/chat.png" width={500} />
                    </div>
                </div>
                <div className="h-[100px]" />
            </div>
        </div>
    );
}
