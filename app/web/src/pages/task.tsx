import { Button } from "@/components/ui/button";
import {
  IconBlocks,
  IconCheck,
  IconAlertTriangle,
  IconAlertOctagon,
  IconCloud,
  IconCube,
  IconPlus,
  IconViewfinder,
  IconCalendar,
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
  IconTag,
  IconSlash,
  IconTrash
} from "@tabler/icons-react";
import { Icon } from "@radix-ui/react-select";
import { TooltipWrapper } from "@/components/super-ui/tooltip-wrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";
import { toggleCreateTaskEvents } from "@/stores/commands";

type TaskPerDayProps = {
  day: string;
  tasks: SingleTaskProps[];
};

export const TaskPage = () => {
  const taskPerDay: TaskPerDayProps[] = [
    {
      day: "Today",
      tasks: [
        {
          id: "STR-43",
          title: "Task 1",
          priority: "1",
          dueDate: new Date()
        }
      ]
    },
    {
      day: "Tomorrow",
      tasks: [
        {
          id: "STR-44",
          title: "Task 2",
          priority: "2",
          dueDate: new Date()
        },
        {
          id: "STR-45",
          title: "Task 3",
          priority: "3",
          dueDate: new Date()
        }
      ]
    }
  ];
  return (
    <div className="h-full w-full">
      <div className="flex h-10 w-full items-center justify-between border-b">
        <div className="flex h-full flex-row items-center justify-center gap-2 pl-4">
          <span className="text-sm font-medium">Tasks</span>
          <div className="flex flex-row items-center gap-2 pl-2">
            <TooltipWrapper
              tooltip={{
                title: "All projects",
                side: "bottom",
                shortcut: ["1"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCube className="size-3" />
                <span className="text-xs">All projects</span>
              </Button>{" "}
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Brume filter",
                side: "bottom",
                shortcut: ["2"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCloud className="size-3" />
                <span className="text-xs">Brume</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Stratumn filter",
                side: "bottom",
                shortcut: ["3"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconBlocks className="size-3" />
                <span className="text-xs">Stratumn</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Create a new view",
                side: "bottom"
              }}
            >
              <Button variant="ghost" size="sm">
                <IconViewfinder className="size-3" />
                <span className="text-xs">New view</span>
              </Button>
            </TooltipWrapper>
          </div>
        </div>
        <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
          <TooltipWrapper
            tooltip={{
              title: "Create a task",
              side: "left",
              shortcut: ["c", "t"]
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCreateTaskEvents()}
            >
              <IconPlus className="size-3" />
              <span className="text-xs">New task</span>
            </Button>
          </TooltipWrapper>
        </div>
      </div>
      <div className="scrollbar-thin mr-3 flex h-[calc(100%-40px)] w-full flex-row gap-3 overflow-x-auto overflow-y-hidden py-3 pl-3">
        {taskPerDay.map((day) => (
          <TaskDayColumn key={day.day} {...day} />
        ))}
      </div>
    </div>
  );
};

const TaskDayColumn = ({ day, tasks }: TaskPerDayProps) => {
  return (
    <div className="h-full w-[350px] min-w-[350px] max-w-[350px] overflow-hidden rounded-md border">
      <div className="from-accent/30 to-accent/10 h-full bg-gradient-to-b">
        <div className="flex flex-row items-center gap-3 p-3">
          <span className="text-sm font-semibold">{day}</span>
        </div>
        <div className="scrollbar-thin flex h-full flex-col gap-2 overflow-y-auto px-2">
          {tasks.map((task) => (
            <SingleTask key={task.title} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
};

type SingleTaskProps = {
  id: string;
  title: string;
  priority: "1" | "2" | "3" | "4" | "5";
  dueDate: Date;
};

const SingleTask = ({ id, title, priority, dueDate }: SingleTaskProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="bg-accent/30 flex select-none flex-col gap-2 rounded border p-2">
          <div className="flex flex-row items-center justify-between">
            <span className="select-none font-mono text-xs text-gray-500">
              {id}
            </span>
            <Avatar className="size-6 select-none">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-row items-center gap-2 py-1">
            <Checkbox />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <TaskPriority priority={priority} />
            <TaskDueDate dueDate={dueDate} />
            <Label label="Label" icon={IconTag} />
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem>
          <IconCheck className="size-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">Complete</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <IconTrash className="size-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const TaskPriority = ({
  priority
}: {
  priority: "1" | "2" | "3" | "4" | "5";
}) => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger>
        <div className="flex select-none flex-row items-center gap-1 rounded border p-[3px]">
          {priority === "5" && (
            <IconAntennaBars1 className="size-4 text-green-700" />
          )}
          {priority === "4" && (
            <IconAntennaBars2 className="size-4 text-blue-700" />
          )}
          {priority === "3" && (
            <IconAntennaBars3 className="size-4 text-yellow-500" />
          )}
          {priority === "2" && (
            <IconAntennaBars4 className="size-4 text-orange-500" />
          )}
          {priority === "1" && (
            <IconAntennaBars5 className="size-4 text-red-500" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="m-1 text-gray-500">
        Task priority is{" "}
        <span className="text-xs font-medium text-gray-600">High</span>
      </TooltipContent>
    </Tooltip>
  );
};

const TaskDueDate = ({ dueDate }: { dueDate: Date }) => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger>
        <div className="shadow-xs flex select-none flex-row items-center gap-1 rounded border p-[3px]">
          <IconCalendar className="size-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric"
            }).format(dueDate)}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="m-1">
        <span className="text-xs font-medium text-gray-500">
          Task scheduled for{" "}
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }).format(dueDate)}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

type LabelProps = {
  label: string;
  icon: React.ElementType;
};

const Label = ({ label, icon: Icon }: LabelProps) => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger>
        <div className="flex select-none flex-row items-center gap-1 rounded-full border py-1 pl-2 pr-3">
          <Icon className="size-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">{label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="m-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </TooltipContent>
    </Tooltip>
  );
};
