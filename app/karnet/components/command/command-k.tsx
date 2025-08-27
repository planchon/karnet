import {
	Icon123,
	IconHelpCircle,
	IconInfinity,
	IconLink,
	IconListDetails,
	IconTextPlus,
	IconTrash,
} from "@tabler/icons-react";
import {
	ArrowRight,
	Briefcase,
	Brush,
	CalendarPlus,
	FilePlus,
	LucideIcon,
	Moon,
	Sparkles,
	Sun,
} from "lucide-react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useCommands, useShortcut } from "@/hooks/useShortcut";
import { useSettings, useStores } from "@/hooks/useStores";
import { generateId } from "@/lib/utils";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/primitive/ui/command";
import type { Command as CommandType } from "@/stores/command.store";

type Group = {
	group: string;
	items: CommandType[];
};

export const CommandK = observer(function CommandK() {
	const router = useRouter();
	const commands = useCommands();
	const settings = useSettings();
	const commandStore = useStores().commandStore;
	const store = useStores();

	useShortcut("Command+k", () => {
		commands.toggleCommandK();
	});

	useShortcut("Control+k", () => {
		commands.toggleCommandK();
	});

	const navigationCommands: Group = {
		group: "Navigation",
		items: [
			{
				name: "Go to agenda",
				shortcut: "g+a",
				action: () => {
					router.push("/agenda");
				},
				icon: ArrowRight,
			},
			{
				name: "Go to tasks",
				shortcut: "g+t",
				action: () => {
					router.push("/task");
				},
				icon: ArrowRight,
			},
			{
				name: "Go to projects",
				shortcut: "g+p",
				action: () => {
					router.push("/project");
				},
				icon: ArrowRight,
			},
			{
				name: "Go to documents",
				shortcut: "g+d",
				action: () => {
					router.push("/file");
				},
				icon: ArrowRight,
			},
			{
				name: "Go to chat",
				shortcut: "g+c",
				action: () => {
					router.push("/chat");
				},
				icon: ArrowRight,
			},
			{
				name: "Go to help",
				shortcut: "?",
				action: () => {
					commands.toggleHelp();
				},
				icon: IconHelpCircle,
			},
		],
	};

	const agendaCommands: Group = {
		group: "Agenda",
		items: [
			{
				name: "Create a new event",
				shortcut: "c+a",
				action: () => {
					commands.toggleEvent();
				},
				icon: CalendarPlus,
			},
		],
	};

	const pagesCommands: Group = {
		group: "Paper",
		items: [
			{
				name: "Create a new paper",
				shortcut: "c+f",
				action: () => {
					const id = generateId();
					store.paperStore.createModel(id);
					router.push(`/paper/${id}`);
				},
				icon: FilePlus,
			},
		],
	};

	const sketchesCommands: Group = {
		group: "Sketches",
		items: [
			{
				name: "Create a new sketch",
				shortcut: "c+s",
				action: () => {
					const id = generateId();
					store.sketchesStore.createModel(id);
					router.push(`/sketch/${id}`);
				},
				icon: Brush,
			},
			{
				name: "Go to the infinite sketch",
				shortcut: "g+S",
				icon: IconInfinity,
				action: () => {
					router.push("/sketch/infinite");
				},
			},
		],
	};

	const chatCommands: Group = {
		group: "Chat",
		items: [
			{
				name: "Create a new chat",
				shortcut: "c+c",
				action: () => {
					commands.toggleChat();
				},
				icon: Sparkles,
			},
		],
	};

	const taskCommands: Group = {
		group: "Tasks",
		items: [
			{
				name: "Create a new task",
				shortcut: "c+t",
				action: () => {
					commands.toggleTask();
				},
				icon: IconTextPlus,
			},
			{
				name: "See all tasks",
				shortcut: "g+t",
				icon: IconListDetails,
				action: () => {
					router.push("/task");
				},
			},
		],
	};

	const projectCommands: Group = {
		group: "Projects",
		items: [
			{
				name: "Create a new project",
				shortcut: "c+p",
				action: () => {
					commands.toggleProject();
				},
				icon: Briefcase,
			},
		],
	};

	const settingsCommands: Group = {
		group: "Settings",
		items: [
			{
				name: "Switch to dark theme",
				shortcut: "",
				action: () => {
					settings.setTheme("dark");
				},
				icon: Moon,
			},
			{
				name: "Switch to light theme",
				shortcut: "",
				action: () => {
					settings.setTheme("light");
				},
				icon: Sun,
			},
			{
				name: `${settings.disableLinks ? "Enable" : "Disable"} links`,
				shortcut: "",
				action: () => {
					settings.setDisableLinks(!settings.disableLinks);
				},
				icon: IconLink,
			},
		],
	};

	const devCommands: Group = {
		group: "Wizard Commands",
		items: [
			{
				name: "Wipe local storage",
				action: () => {
					localStorage.clear();
					window.location.reload();
				},
				icon: IconTrash,
			},
		],
	};

	const commandsList: Group[] = [
		...commandStore.contextualCommands,
		taskCommands,
		agendaCommands,
		pagesCommands,
		sketchesCommands,
		chatCommands,
		projectCommands,
		settingsCommands,
		navigationCommands,
		devCommands,
	];

	return (
		<CommandDialog
			open={commands.commandKOpen}
			onOpenChange={(open) => {
				commands.toggleCommandK();
				if (!open) {
					if (commands.lastFocus) {
						const element = document.getElementById(commands.lastFocus);
						if (element) {
							setTimeout(() => {
								element.focus();
							}, 0);
						}
					}
				}
			}}
			className="min-w-[700px]"
		>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{commandsList.map((command: Group) => (
					<CommandGroup key={command.group} heading={command.group}>
						{command.items.map((item: CommandType) => (
							<CommandItem
								key={item.name}
								className="hover:cursor-pointer"
								onSelect={() => {
									item.action();
									commands.toggleCommandK();
									if (commands.lastFocus) {
										const element = document.getElementById(commands.lastFocus);
										if (element) {
											setTimeout(() => {
												element.focus();
											}, 0);
										}
									}
								}}
							>
								{item.icon && <item.icon className="ml-1" />}
								<span>{item.name}</span>
								<CommandShortcut className="mr-1">
									{item.shortcut}
								</CommandShortcut>
							</CommandItem>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</CommandDialog>
	);
});
