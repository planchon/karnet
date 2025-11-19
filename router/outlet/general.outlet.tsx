"use client";

import { useAuth } from "@clerk/react-router";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useHotkeys } from "react-hotkeys-hook";
import { Outlet, useNavigate } from "react-router";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/primitive/ui/sidebar";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
        },
    },
});
convexQueryClient.connect(queryClient);

export function GeneralOutlet() {
    const navigate = useNavigate();

    const useLinkShortcut = (shortcut: string, href: string) => {
        useHotkeys(shortcut, () => {
            navigate(href);
        });
    };

    useLinkShortcut("g+a", "/agenda");
    useLinkShortcut("g+t", "/task");

    useLinkShortcut("g+c", "/chat");
    useLinkShortcut("c+c", "/chat");

    useLinkShortcut("g+d", "/document");
    useLinkShortcut("g+f", "/document?type=file");
    useLinkShortcut("g+s", "/document?type=sketch");

    useHotkeys("Control+o", () => {
        navigate(-1);
    });

    useHotkeys("Command+o", () => {
        navigate(-1);
    });

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
                <Authenticated>
                    <SidebarProvider>
                        <AppSidebar variant="inset" />
                        <SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
                            <Outlet />
                        </SidebarInset>
                        <Toaster />
                    </SidebarProvider>
                </Authenticated>
            </QueryClientProvider>
        </ConvexProviderWithClerk>
    );
}
