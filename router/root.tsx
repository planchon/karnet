"use client";

import { ClerkProvider } from "@clerk/react-router";
import { BrowserRouter } from "react-router";
import { GeneralAppRouter } from "./router";

export const Root = () => (
    <div>
        <BrowserRouter>
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                <GeneralAppRouter />
            </ClerkProvider>
        </BrowserRouter>
        {/* <div className="absolute h-screen w-screen bg-sidebar" /> */}
    </div>
);
