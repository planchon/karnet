import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function RouteError({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-semibold text-2xl">Unexpected error</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <div className="flex gap-2">
        <Button onClick={reset} type="button">
          Try again
        </Button>
        <Button render={<Link to="/" />} variant="outline">
          Go home
        </Button>
      </div>
    </div>
  );
}
