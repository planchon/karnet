import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function RouteNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-semibold text-2xl">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button render={<Link to="/" />}>Go home</Button>
    </div>
  );
}
