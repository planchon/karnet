import {
  IconAntennaBars5,
  IconCalendar,
  IconChevronRight,
  IconLabel,
} from '@tabler/icons-react';
import { observer } from 'mobx-react';
import usePreventAutoFocus from '@/hooks/usePreventAutoFocus';
import { useCommands, useShortcut } from '@/hooks/useShortcut';
import { Button } from '@/primitive/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/primitive/ui/dialog';
import { Switch } from '@/primitive/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/primitive/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../../primitive/super-ui/select';
import { TaskInputComp } from '../task-input/task-input.comp';

export const CreateTaskCommand = observer(function CreateTaskCommandComp() {
  const commands = useCommands();

  const preventAutoFocus = usePreventAutoFocus();

  useShortcut('c+t', () => {
    commands.toggleTask();
  });

  return (
			<Dialog onOpenChange={commands.toggleTask} open={commands.taskOpen}>
				<DialogContent className="min-w-[700px] p-0" {...preventAutoFocus}>
					<div className="flex w-full flex-col gap-3 p-3 pb-0">
						<div className="flex items-center gap-2">
							{/* <ProjectSelect />
            <IconChevronRight className="size-4 text-accent-foreground/60" /> */}
							<span className="select-none font-regular text-xs">
								Create a new task
							</span>
						</div>
						<div className="flex flex-col gap-3">
							<TaskInputComp />
						</div>
						<div className="flex w-full select-none flex-row gap-2 pt-3">
							<TaskLabel />
							<TaskPriority />
							<Deadline />
						</div>
					</div>
					<div className="w-full border-b" />
					<DialogFooter className="px-3 pb-3">
						<div className="flex select-none items-center gap-2">
							<Switch />
							<span className="text-xs">Create more</span>
						</div>
						<Button>Create</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
});

const ProjectSelect = observer(function ProjectSelectComp() {
  return (
			<Tooltip delayDuration={800}>
				<TooltipTrigger autoFocus={false}>
					<Select>
						<SelectTrigger
							className="border shadow-none"
							showChevron={false}
							size="sm"
						>
							<IconLabel className="size-4 text-accent-foreground/60" />
							<span className="font-medium text-accent-foreground/60 text-xs">
								Stratumn
							</span>
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
					<span className="font-medium text-gray-500 text-xs">
						Select the project
					</span>
				</TooltipContent>
			</Tooltip>
		);
});

const TaskLabel = observer(function TaskLabelComp() {
  return (
			<Tooltip delayDuration={800}>
				<TooltipTrigger autoFocus={false}>
					<Select>
						<SelectTrigger showChevron={false} size="sm" tabIndex={0}>
							<IconLabel className="size-4 text-accent-foreground/60" />
							<span className="font-medium text-accent-foreground/60 text-xs">
								Tags
							</span>
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
					<span className="font-medium text-gray-500 text-xs">
						Project label
					</span>
				</TooltipContent>
			</Tooltip>
		);
});

const TaskPriority = observer(function TaskPriorityComp() {
  return (
			<Tooltip delayDuration={800}>
				<TooltipTrigger autoFocus={false}>
					<Select>
						<SelectTrigger className="w-7 pl-1" showChevron={false} size="sm">
							<IconAntennaBars5 className="size-4 text-accent-foreground/60" />
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
					<span className="font-medium text-gray-500 text-xs">
						Task priority
					</span>
				</TooltipContent>
			</Tooltip>
		);
});

const Deadline = observer(function DeadlineComp() {
  return (
			<Tooltip delayDuration={800}>
				<TooltipTrigger autoFocus={false}>
					<Select>
						<SelectTrigger
							className="w-7 pl-[5px]"
							showChevron={false}
							size="sm"
						>
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
					<span className="font-medium text-gray-500 text-xs">
						Task deadline
					</span>
				</TooltipContent>
			</Tooltip>
		);
});
