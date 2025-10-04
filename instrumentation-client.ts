import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
});

Sentry.init({
    dsn: "https://85c164d195e3a6452b517ec4aa7e4194@o4509537188249600.ingest.de.sentry.io/4510130457608272",

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    tracePropagationTargets: ["https://karnet.app"],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
