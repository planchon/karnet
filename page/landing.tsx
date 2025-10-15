import { useAuth, Waitlist } from "@clerk/react-router";
import { Link, Navigate } from "react-router";

export default function LandingPage() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Navigate to="/chat" />;
    }

    return (
        <div className="flex h-screen w-screen flex-row items-center justify-between gap-2">
            <Link
                className="absolute top-4 right-4 rounded-md p-2 px-4 text-gray-700 text-sm transition-all duration-100 hover:bg-gray-100"
                to="/login"
            >
                Sign in
            </Link>
            <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2">
                <h1 className="font-bold text-4xl">karnet.app</h1>
                <p className="text-gray-500 text-sm">Your magical notebook</p>
                <p className="pt-4 text-gray-500">ai powered knowledge and organization tool adapted for you </p>
            </div>
            <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2">
                <Waitlist />
            </div>
        </div>
    );
}
