import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const title = import.meta.env.VITE_APP_TITLE ?? "Template";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
        <p className="max-w-md text-muted-foreground">
          React 19 starter with TanStack Router, Query, and shadcn/ui.
        </p>
      </div>
      {import.meta.env.DEV ? (
        <Button render={<Link to="/playground" />}>
          Open component playground
        </Button>
      ) : null}
    </div>
  );
}
