"use client";

import { SignedIn } from "@clerk/nextjs";

export const IsLoggedIn = () => (
    <SignedIn>
        <RedirectToChat />
    </SignedIn>
);

export const RedirectToChat = () => {
    window.location.href = "/chat";

    return null;
};
