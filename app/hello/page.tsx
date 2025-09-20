import { Input } from '@ui/input';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center">
                <h2 className="font-bold text-4xl">Karnet</h2>
                <h2 className="font-medium text-xl">your magical notebook</h2>
            </div>
            <div className="absolute bottom-4 flex flex-col items-start gap-4">
                <div>
                    <h2 className="font-medium text-sm">Private Alpha</h2>
                    <p className="text-muted-foreground text-sm">enter your email to get early access</p>
                </div>
                <Input className="w-96" placeholder="Enter your email" />
            </div>
            <Link className="absolute top-4 right-4" href="/login">
                <button
                    className="rounded-full bg-[#131316] px-4 py-2 font-semibold text-sm text-white hover:cursor-pointer"
                    type="button"
                >
                    Sign in
                </button>
            </Link>
        </div>
    );
}
