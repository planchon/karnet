"use client";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/react-router";
import { BrowserRouter } from "react-router";
import { GeneralAppRouter } from "./router";

export const Root = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <SignedIn>
                <GeneralAppRouter />
            </SignedIn>
            <SignedOut>{children}</SignedOut>
        </ClerkProvider>
    </BrowserRouter>
);
