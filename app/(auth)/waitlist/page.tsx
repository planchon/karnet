import { ClerkProvider, Waitlist } from "@clerk/nextjs";

export default function WaitlistPage() {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <div className="flex h-screen w-screen items-center justify-center">
                <Waitlist />
            </div>
        </ClerkProvider>
    );
}
