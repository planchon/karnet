import {
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
  IconCalendar,
  IconLabel,
} from '@tabler/icons-react';
import { observer } from 'mobx-react';
import { useState } from 'react';
import usePreventAutoFocus from '@/hooks/usePreventAutoFocus';
import { useCommands, useShortcut } from '@/hooks/useShortcut';
import { useStores } from '@/hooks/useStores';
import { useResetFocus } from '@/lib/focus-manager';
import { cn, generateId } from '@/lib/utils';
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
  const { taskStore } = useStores();
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [deadline, setDeadline] = useState<string | undefined>(undefined);
  const [task, setTask] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const preventAutoFocus = usePreventAutoFocus();
  const resetFocus = useResetFocus();

  useShortcut('c+t', () => {
    commands.toggleTask();
  });

  const createTask = () => {
    console.log(task, priority, deadline);
    const id = generateId();
    const taskModel = taskStore.createNewModel(id);
    taskModel.setDeadline(deadline);
    taskModel.setPriority(priority);
    taskModel.setTitle(task);
    taskModel.save();
    taskStore.save();
  };

  const onCreateTask = () => {
    if (!commands.taskOpen) {
      return;
    }

    commands.closeTask();
    createTask();
    reset();
  };

  useShortcut('Control+Enter', () => {
    onCreateTask();
  });

  useShortcut('Command+Enter', () => {
    onCreateTask();
  });

  const onTagChange = (value: string) => {
    setTags([...tags, value]);
  };

  const onPriorityChange = (value: string | undefined) => {
    if (!value) {
      setPriority(undefined);
      return;
    }

    const priorityNumber = Number.parseInt(value, 10);
    setPriority(priorityNumber);
  };

  const onDeadlineChange = (value: string | undefined) => {
    if (!value) {
      setDeadline(undefined);
      return;
    }

    setDeadline(value);
  };

  const onTitleChange = (value: string) => {
    console.log('onTitleChange', value);
    setTask(value);
  };

  const reset = () => {
    setTask('');
    setPriority(undefined);
    setDeadline(undefined);
    setTags([]);
    resetFocus();
  };

  const onToggleChange = () => {
    commands.toggleTask();
    reset();
  };

  return (
    <Dialog onOpenChange={onToggleChange} open={commands.taskOpen}>
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
            <TaskInputComp
              onDeadlineChange={onDeadlineChange}
              onPriorityChange={onPriorityChange}
              onValueChange={onTitleChange}
            />
          </div>
          <div className="flex w-full select-none flex-row gap-2 pt-3">
            <TaskLabel onTagChange={onTagChange} priority={priority} />
            <TaskPriority
              onPriorityChange={onPriorityChange}
              priority={priority}
            />
            <Deadline deadline={deadline} onDeadlineChange={onDeadlineChange} />
          </div>
        </div>
        <div className="w-full border-b" />
        <DialogFooter className="px-3 pb-3">
          <div className="flex select-none items-center gap-2">
            <Switch tabIndex={-1} />
            <span className="text-xs">Create more</span>
          </div>
          <Button tabIndex={0}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const ProjectSelect = observer(function ProjectSelectComp() {
  return (
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
  );
});

const TaskLabel = observer(function TaskLabelComp({
  onTagChange,
  priority,
}: {
  onTagChange: (value: string) => void;
  priority: number | undefined;
}) {
  return (
    <Select onValueChange={onTagChange} value={priority?.toString()}>
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
  );
});

const TaskPriority = observer(function TaskPriorityComp({
  onPriorityChange,
  priority,
}: {
  onPriorityChange: (value: string) => void;
  priority: number | undefined;
}) {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select
          onValueChange={onPriorityChange}
          value={priority?.toString() || ''}
        >
          <SelectTrigger
            className={cn(
              'pl-1',
              !priority && 'w-7',
              priority && 'gap-x-[5px] pr-2'
            )}
            showChevron={false}
            size="sm"
            tabIndex={-1}
          >
            <IconAntennaBars5 className="size-4 text-accent-foreground/60" />
            {priority && (
              <span className="text-accent-foreground/80 text-xs">
                p{priority}
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <IconAntennaBars5 className="size-4 text-accent-foreground/80" />
              Priority 1
            </SelectItem>
            <SelectItem value="2">
              <IconAntennaBars4 className="size-4 text-accent-foreground/80" />
              Priority 2
            </SelectItem>
            <SelectItem value="3">
              <IconAntennaBars3 className="size-4 text-accent-foreground/80" />
              Priority 3
            </SelectItem>
            <SelectItem value="4">
              <IconAntennaBars2 className="size-4 text-accent-foreground/80" />
              Priority 4
            </SelectItem>
          </SelectContent>
        </Select>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-medium text-gray-500 text-xs">Task priority</span>
      </TooltipContent>
    </Tooltip>
  );
});

const Deadline = observer(function DeadlineComp({
  onDeadlineChange,
  deadline,
}: {
  onDeadlineChange: (value: string) => void;
  deadline: string | undefined;
}) {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select onValueChange={onDeadlineChange} value={deadline}>
          <SelectTrigger
            className={cn(
              'pl-1',
              !deadline && 'w-7',
              deadline && 'gap-x-[5px] pr-2'
            )}
            showChevron={false}
            size="sm"
            tabIndex={-1}
          >
            <IconCalendar className="ml-[1px] size-4 text-accent-foreground/60" />
            {deadline && (
              <span className="text-accent-foreground/80 text-xs">
                {deadline}
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demain">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Demain
            </SelectItem>
            <SelectItem value="lundi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Lundi
            </SelectItem>
            <SelectItem value="mardi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Mardi
            </SelectItem>
            <SelectItem value="mercredi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Mercredi
            </SelectItem>
            <SelectItem value="jeudi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Jeudi
            </SelectItem>
            <SelectItem value="vendredi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Vendredi
            </SelectItem>
            <SelectItem value="samedi">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Samedi
            </SelectItem>
            <SelectItem value="dimanche">
              <IconLabel className="size-4 text-accent-foreground/80" />
              Dimanche
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
