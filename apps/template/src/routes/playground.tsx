import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { RoutePending } from "@/components/route-pending";

function PlaygroundUnavailable() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <p className="text-muted-foreground">
        Playground is only available in development.
      </p>
    </div>
  );
}

const DevPlayground = import.meta.env.DEV
  ? lazy(() => import("@/playground"))
  : null;

function PlaygroundRoute() {
  if (DevPlayground) {
    return (
      <Suspense fallback={<RoutePending />}>
        <DevPlayground />
      </Suspense>
    );
  }

  return <PlaygroundUnavailable />;
}

export const Route = createFileRoute("/playground")({
  component: PlaygroundRoute,
});
