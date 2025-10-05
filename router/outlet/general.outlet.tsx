"use client";

import { useAuth } from "@clerk/react-router";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Outlet, useNavigate } from "react-router";
import { CommandChat } from "@/components/command/command-chat";
import { CreateEventCommand } from "@/components/command/command-events";
import { CommandK } from "@/components/command/command-k";
import { CreateProjectCommand } from "@/components/command/command-project";
import { CreateTaskCommand } from "@/components/command/command-task";
import { HelpComponent } from "@/components/help/help.comp";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import { useLinkShortcut, useShortcut } from "@/hooks/useShortcut";
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

    useLinkShortcut("g+a", "/agenda");
    useLinkShortcut("g+t", "/task");

    useLinkShortcut("g+c", "/chat");
    useLinkShortcut("c+c", "/chat");

    useLinkShortcut("g+d", "/document");
    useLinkShortcut("g+f", "/document?type=file");
    useLinkShortcut("g+s", "/document?type=sketch");

    useShortcut("Control+o", () => {
        navigate(-1);
    });

    useShortcut("Command+o", () => {
        navigate(-1);
    });

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
                <Authenticated>
                    <SidebarProvider>
                        <CommandK />
                        <CreateEventCommand />
                        <CommandChat />
                        <HelpComponent />
                        <CreateTaskCommand />
                        <CreateProjectCommand />
                        <AppSidebar variant="inset" />
                        <SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
                            <Outlet />
                        </SidebarInset>
                    </SidebarProvider>
                </Authenticated>
            </QueryClientProvider>
        </ConvexProviderWithClerk>
    );
}
