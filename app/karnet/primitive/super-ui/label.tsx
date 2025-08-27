import { observer } from "mobx-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/primitive/ui/tooltip";
import { cn } from "@/lib/utils";

type LabelProps = {
  label: string;
  icon: React.ElementType;
  className?: string;
};

export const Label = observer(function Label({
  label,
  icon: Icon,
  className
}: LabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            "shadow-xs flex select-none flex-row items-center gap-1 rounded-full border py-1 pl-2 pr-3",
            className
          )}
        >
          <Icon className="size-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">{label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="m-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </TooltipContent>
    </Tooltip>
  );
});
