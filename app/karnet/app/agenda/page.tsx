"use client";

import type {
	DayHeaderContentArg,
	EventContentArg,
	SlotLabelContentArg,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { IconBlocks, IconCloud, IconCube, IconPlus } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { useState } from "react";
import { useCommands, useShortcut } from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import { Button } from "@/primitive/ui/button";

export default observer(function AgendaPage() {
	const commands = useCommands();

	useShortcut(
		"n",
		() => {
			commands.toggleEvent();
		},
		{ disableTextInputs: true, capture: true },
	);

	return (
		<div className="h-full w-full">
			<div className="flex h-10 w-full items-center justify-between border-b">
				<div className="flex h-full flex-row items-center justify-center gap-2 pl-4">
					<span className="font-medium text-sm">Agenda</span>
					<div className="flex flex-row items-center gap-2 pl-2">
						<TooltipWrapper
							tooltip={{
								title: "Show all agenda",
								side: "bottom",
								shortcut: ["1"],
							}}
						>
							<Button size="sm" variant="outline">
								<IconCube className="size-3" />
								<span className="text-xs">All agenda</span>
							</Button>{" "}
						</TooltipWrapper>
						<TooltipWrapper
							tooltip={{
								title: "Only show google agenda",
								side: "bottom",
								shortcut: ["2"],
							}}
						>
							<Button size="sm" variant="outline">
								<IconCloud className="size-3" />
								<span className="text-xs">Google</span>
							</Button>
						</TooltipWrapper>
						<TooltipWrapper
							tooltip={{
								title: "Only show apple agenda",
								side: "bottom",
								shortcut: ["3"],
							}}
						>
							<Button size="sm" variant="outline">
								<IconBlocks className="size-3" />
								<span className="text-xs">Apple</span>
							</Button>
						</TooltipWrapper>
					</div>
				</div>
				<div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
					<TooltipWrapper
						tooltip={{
							title: "Create a task",
							side: "left",
							shortcut: ["n"],
						}}
					>
						<Button
							onClick={() => commands.toggleEvent()}
							size="sm"
							variant="ghost"
						>
							<IconPlus className="size-3" />
							<span className="text-xs">New event</span>
						</Button>
					</TooltipWrapper>
				</div>
			</div>
			<div className="h-[calc(100%-40px)] w-full overflow-x-auto overflow-y-hidden">
				<AgendaComponent />
			</div>
		</div>
	);
});

export const AgendaComponent = observer(() => {
	const [events, setEvents] = useState([
		{
			title: "Sample Event",
			start: new Date(),
			end: new Date(new Date().setHours(new Date().getHours() + 2)),
		},
	]);

	const handleDateSelect = (selectInfo: any) => {
		const title = prompt("Please enter a title for your event");
		if (title) {
			setEvents([
				...events,
				{
					title,
					start: selectInfo.start,
					end: selectInfo.end,
				},
			]);
		}
	};

	return (
		<div className="calendar-container h-full w-full">
			<FullCalendar
				allDaySlot={false}
				dayHeaderContent={(arg) => {
					return <DayHeader arg={arg} />;
				}}
				dayHeaderFormat={{
					weekday: "short",
					day: "numeric",
					month: "short",
				}}
				dayMaxEvents={true}
				editable={true}
				eventBackgroundColor="transparent"
				eventBorderColor="transparent"
				eventContent={(arg) => {
					return <Event arg={arg} />;
				}}
				events={events}
				firstDay={1}
				headerToolbar={false}
				height="100%"
				initialView="timeGridWeek"
				nowIndicator={true}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				scrollTime="08:00:00"
				select={handleDateSelect}
				selectable={true}
				selectMirror={true}
				slotDuration="00:30:00"
				slotLabelContent={(arg) => {
					return <SlotLabel arg={arg} />;
				}}
				themeSystem="standard"
				weekends={true}
			/>
		</div>
	);
});

const Event = ({ arg }: { arg: EventContentArg }) => {
	return (
		<div className="flex h-full select-none justify-end">
			<div className="contents">
				<div
					className="group/event-item before:-inset-px relative min-w-full cursor-pointer rounded border border-muted-foreground bg-muted before:absolute before:block before:w-1 before:rounded-l before:bg-blue-500"
					role="button"
					style={{ height: "100%" }}
				>
					<div className="grid grid-cols-[auto_1fr] items-start gap-2 overflow-hidden py-0.5 pr-1 pl-2 text-muted-foreground text-xs leading-4">
						<div className="pt-0.5">
							{arg.event.title && (
								<button
									aria-expanded="false"
									aria-haspopup="dialog"
									aria-label="Complete task"
									className="group"
								>
									<div className="group-hover:flex">
										<svg
											className="inline-flex shrink-0 text-gray-500"
											fill="none"
											height="11"
											viewBox="0 0 18 18"
											width="11"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="9" cy="9" fill="#30A66D" r="8" />
											<path
												clipRule="evenodd"
												d="M12.4826 5.87087C12.7611 6.1029 12.7987 6.51671 12.5666 6.79514L8.52774 11.6418C8.09047 12.1666 7.28454 12.1666 6.84726 11.6418L4.99586 9.42014C4.76383 9.14171 4.80145 8.7279 5.07988 8.49587C5.35831 8.26384 5.77212 8.30146 6.00415 8.5799L7.6875 10.5999L11.5584 5.9549C11.7904 5.67646 12.2042 5.63884 12.4826 5.87087Z"
												fill="white"
												fillRule="evenodd"
											/>
										</svg>
									</div>
								</button>
							)}
						</div>
						<div className="flex min-w-0 flex-col gap-0.5">
							<div data-line-count="6">
								<div className="line-clamp-6 break-words font-medium">
									<div
										className="float-right ml-auto inline-flex max-w-[calc(100%-4px)] flex-row items-center gap-0.5 px-0.5 py-0.5 pt-1"
										data-state="closed"
									>
										<svg
											className="h-2.5 w-2.5 shrink-0 text-red-500"
											data-icon="exclamation-circle-solid"
											height="24"
											width="24"
										>
											<use xlinkHref="/20250530_1734_b28e53d7/images/__spritemap_37515358.svg#exclamation-circle-solid" />
										</svg>
									</div>
									<span
										className="overflow-hidden text-ellipsis"
										data-state="closed"
									>
										{arg.event.title}
									</span>
								</div>
							</div>
							<span className="truncate font-thin text-[9px] text-muted-foreground leading-none">
								{arg.event.start?.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
								-
								{arg.event.end?.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SlotLabel = ({ arg }: { arg: SlotLabelContentArg }) => {
	return (
		<div className="w-18 select-none">
			<span className="font-medium text-muted-foreground text-xs">
				{arg.text}
			</span>
		</div>
	);
};

const DayHeader = ({ arg }: { arg: DayHeaderContentArg }) => {
	return (
		<div className="select-none py-[5.5px]">
			<span
				className={cn(
					"font-medium text-muted-foreground text-xs",
					arg.isToday && "font-semibold",
				)}
			>
				{arg.text}
			</span>
		</div>
	);
};
