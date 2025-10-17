"use client";

import { IconLabel } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCommands } from "@/hooks/useCommand";
import { Button } from "@/primitive/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/primitive/ui/dialog";
import { Switch } from "@/primitive/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/primitive/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../primitive/super-ui/select";

export const CreateProjectCommand = observer(function CreateProjectCommandInner() {
    const commands = useCommands();

    useHotkeys("c+p", () => {
        commands.toggleProject();
    });

    return (
        <Dialog onOpenChange={commands.toggleProject} open={commands.projectOpen}>
            <DialogContent className="z-1000 min-w-[700px] p-0">
                <div className="flex h-full min-h-[200px] w-full flex-col gap-3 p-3 pb-0">
                    <div className="flex items-center gap-2">
                        <span className="font-regular text-xs">Create a new project</span>
                    </div>
                    <div className="flex h-full flex-col gap-3">
                        <input
                            autoFocus
                            className="min-h-[20px] w-full resize-none bg-transparent text-field-text-default text-md outline-none placeholder:text-field-text-placeholder disabled:text-field-text-disabled"
                            placeholder="Project name"
                            type="text"
                        />
                        <textarea
                            className="min-h-full w-full resize-none bg-transparent text-field-text-default text-sm outline-none placeholder:text-field-text-placeholder disabled:text-field-text-disabled"
                            placeholder="Description of the project"
                        />
                    </div>
                    <div className="flex w-full flex-row">
                        <ProjectLabel />
                    </div>
                </div>
                <div className="w-full border-b" />
                <DialogFooter className="px-3 pb-3">
                    <div className="flex select-none items-center gap-2">
                        <Switch />
                        <span className="text-xs">Create more</span>
                    </div>
                    <Button size="sm">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

const ProjectLabel = observer(function ProjectLabelInner() {
    return (
        <Tooltip delayDuration={800}>
            <TooltipTrigger autoFocus={false}>
                <Select>
                    <SelectTrigger showChevron={false} size="sm">
                        <IconLabel className="size-4 text-accent-foreground/60" />
                        <span className="font-medium text-accent-foreground/60 text-xs">Tags</span>
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
                <span className="font-medium text-gray-500 text-xs">Project label</span>
            </TooltipContent>
        </Tooltip>
    );
});
