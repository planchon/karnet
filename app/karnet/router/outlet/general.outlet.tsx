"use client";

import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandChat } from "@/components/command/command-chat";
import { CreateEventCommand } from "@/components/command/command-events";
import { CommandK } from "@/components/command/command-k";
import { CreateProjectCommand } from "@/components/command/command-project";
import { CreateTaskCommand } from "@/components/command/command-task";
import { HelpComponent } from "@/components/help/help.comp";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import { useLinkShortcut, useShortcut } from "@/hooks/useShortcut";
import { SidebarInset, SidebarProvider } from "@/primitive/ui/sidebar";
import { rootStore } from "@/stores/root.store";

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

export function GeneralOutlet({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useLinkShortcut("g+a", "/agenda");
	useLinkShortcut("g+t", "/task");

	useLinkShortcut("g+c", "/chat");
	useLinkShortcut("c+c", "/chat");

	useLinkShortcut("g+d", "/document");
	useLinkShortcut("g+f", "/document?type=file");
	useLinkShortcut("g+s", "/document?type=sketch");

	useShortcut("Control+o", () => {
		router.back();
	});

	useShortcut("Command+o", () => {
		router.back();
	});

	useEffect(() => {
		console.group("loading stores");
		console.time("loading stores");

		rootStore.sketchesStore.load();
		rootStore.paperStore.load();
		rootStore.diagramStore.load();
		rootStore.taskStore.load();

		console.timeEnd("loading stores");
		console.groupEnd();
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return null;
	}

	return (
		<ConvexProvider client={convex}>
			<QueryClientProvider client={queryClient}>
				<SidebarProvider>
					<CommandK />
					<CreateEventCommand />
					<CommandChat />
					<HelpComponent />
					<CreateTaskCommand />
					<CreateProjectCommand />
					<AppSidebar variant="inset" />
					<SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
						{children}
					</SidebarInset>
				</SidebarProvider>
			</QueryClientProvider>
		</ConvexProvider>
	);
}
