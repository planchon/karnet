"use client";

import { IconCalendar, IconChevronRight, IconLabel } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCommands } from "@/hooks/useCommand";
import usePreventAutoFocus from "@/hooks/usePreventAutoFocus";
import { Button } from "@/primitive/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/primitive/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/primitive/ui/select";
import { Switch } from "@/primitive/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/primitive/ui/tooltip";
import { DateTimePicker } from "../../primitive/super-ui/date-time-picker";

export const CreateEventCommand = observer(function CreateEventCommandInner() {
    const commands = useCommands();

    const preventAutoFocus = usePreventAutoFocus();

    useHotkeys("c+e", () => {
        commands.toggleEvent();
    });

    return (
        <Dialog onOpenChange={commands.toggleEvent} open={commands.eventOpen}>
            <DialogContent className="min-w-[700px] p-0" {...preventAutoFocus}>
                <div className="flex w-full flex-col gap-3 p-3 pb-0">
                    <div className="flex items-center gap-2">
                        <CalendarSelect tabIndex={1} />
                        <IconChevronRight className="size-3" />
                        <span className="font-regular text-xs">New event</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <input
                            autoFocus
                            className="min-h-[20px] w-full resize-none bg-transparent text-field-text-default text-sm outline-none placeholder:text-field-text-placeholder disabled:text-field-text-disabled"
                            placeholder="Event name"
                            tabIndex={2}
                            type="text"
                        />
                    </div>
                    <div className="flex w-full select-none flex-row gap-2 pt-3">
                        <div>
                            <DateTimePicker tabIndex={3} />
                        </div>
                    </div>
                </div>
                <div className="w-full border-b" />
                <DialogFooter className="px-3 pb-3">
                    <div className="flex select-none items-center gap-2">
                        <Switch tabIndex={4} />
                        <span className="text-xs">Create more</span>
                    </div>
                    <Button tabIndex={5}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

const CalendarSelect = observer(function CalendarSelectInner({ tabIndex }: { tabIndex: number }) {
    return (
        <Tooltip delayDuration={800}>
            <TooltipTrigger autoFocus={false}>
                <Select>
                    <SelectTrigger className="border shadow-none" showChevron={false} size="sm" tabIndex={tabIndex}>
                        <IconLabel className="size-4 text-accent-foreground/60" />
                        <span className="font-medium text-accent-foreground/60 text-xs">Stratumn</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">
                            <IconLabel className="size-4 text-accent-foreground/80" />
                            test
                        </SelectItem>
                        <SelectItem value="2">
                            <IconLabel className="size-4 text-accent-foreground/80" />
                            test
                        </SelectItem>
                    </SelectContent>
                </Select>
            </TooltipTrigger>
            <TooltipContent>
                <span className="font-medium text-gray-500 text-xs">Select the calendar</span>
            </TooltipContent>
        </Tooltip>
    );
});

const Deadline = observer(function Deadline() {
    return (
        <Tooltip delayDuration={800}>
            <TooltipTrigger autoFocus={false}>
                <Select>
                    <SelectTrigger className="w-8 pl-[7px]" showChevron={false} size="sm">
                        <IconCalendar className="size-4 text-accent-foreground/60" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">
                            <IconLabel className="size-4 text-accent-foreground/80" />
                            test
                        </SelectItem>
                        <SelectItem value="2">
                            <IconLabel className="size-4 text-accent-foreground/80" />
                            test
                        </SelectItem>
                    </SelectContent>
                </Select>
            </TooltipTrigger>
            <TooltipContent>
                <span className="font-medium text-gray-500 text-xs">Task deadline</span>
            </TooltipContent>
        </Tooltip>
    );
});
