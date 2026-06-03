import { createRouter } from "@tanstack/react-router";
import { RouteError } from "@/components/route-error";
import { RouteNotFound } from "@/components/route-not-found";
import { RoutePending } from "@/components/route-pending";
import { createQueryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export const queryClient = createQueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: RouteError,
  defaultNotFoundComponent: RouteNotFound,
  defaultPendingComponent: RoutePending,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
