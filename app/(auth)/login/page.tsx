import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <div className="flex h-screen w-screen items-center justify-center">
                <SignIn forceRedirectUrl={"/chat"} />
            </div>
        </ClerkProvider>
    );
}
