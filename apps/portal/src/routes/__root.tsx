import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { RouteError } from "@/components/route-error";
import { RouteNotFound } from "@/components/route-not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { RouterContext } from "@/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function RootRoute() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Outlet />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
