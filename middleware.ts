import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
    const authRes = await auth();

    const landingRoutes = ["/login", "/waitlist", "/"];

    if (authRes.isAuthenticated && landingRoutes.includes(req.nextUrl.pathname) && req.nextUrl.pathname !== "/chat") {
        return NextResponse.redirect(new URL("/chat", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
