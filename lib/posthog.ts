import { PostHog } from "posthog-node";

const isDisabled = typeof window !== "undefined" && window.location.hostname === "localhost";

export const phClient = new PostHog("phc_XYT586PTxSVpJWZDqhEcT14cB3d8aZTBCPCdQ2LrbiY", {
    host: "https://eu.i.posthog.com",
    disabled: isDisabled,
});
