import { ClerkProvider } from "@clerk/nextjs";
import { IsLoggedIn } from "@/lib/login";

export default function AfterLoginPage() {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <IsLoggedIn />
        </ClerkProvider>
    );
}
