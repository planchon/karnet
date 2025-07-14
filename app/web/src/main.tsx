import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Router } from './router/router';
import './index.css';
import { ErrorBoundary, init, replayIntegration } from '@sentry/react';
import { PostHogProvider } from 'posthog-js/react';
import { Toaster } from './primitive/ui/sonner';
import { TooltipProvider } from './primitive/ui/tooltip';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}
const App = () => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <TooltipProvider
        delayDuration={800}
        disableHoverableContent
        skipDelayDuration={1000}
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
};

if (import.meta.env.PROD) {
  console.info('Launching the app in production mode');

  init({
    dsn: 'https://1f36c7292465425931c5885022604bb0@o4509537188249600.ingest.de.sentry.io/4509572668457040',
    sendDefaultPii: true,
    integrations: [replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });

  createRoot(rootElement).render(
    <ErrorBoundary>
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          capture_exceptions: true,
          debug: false,
        }}
      >
        <App />
      </PostHogProvider>
    </ErrorBoundary>
  );
} else {
  createRoot(rootElement).render(<App />);
}
