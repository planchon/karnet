import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Router } from "./router/router";
import "./index.css";
import { TooltipProvider } from "./primitive/ui/tooltip";
import { Toaster } from "./primitive/ui/sonner";
import * as Sentry from "@sentry/react";
import { PostHogProvider } from "posthog-js/react";

Sentry.init({
  dsn: "https://1f36c7292465425931c5885022604bb0@o4509537188249600.ingest.de.sentry.io/4509572668457040",
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        capture_exceptions: true
      }}
    >
      <Toaster richColors position="bottom-right" />
      <TooltipProvider
        delayDuration={800}
        skipDelayDuration={1000}
        disableHoverableContent
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </TooltipProvider>
    </PostHogProvider>
  </StrictMode>
);
