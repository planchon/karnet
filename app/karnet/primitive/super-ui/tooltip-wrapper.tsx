import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/primitive/ui/tooltip";
import { Shortcut } from "@/primitive/ui/shortcut";
import { useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";
import { cn } from "@/lib/utils";

type SuperUITooltipWrapperProps = {
  children: React.ReactNode;
  tooltip: {
    title: string;
    side?: "top" | "right" | "bottom" | "left";
    shortcut?: string[];
  };
  className?: string;
};

const TooltipWrapperComponent = ({
  children,
  tooltip,
  className
}: SuperUITooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger className={cn("w-[calc(100%-8px)]", className)}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={tooltip.side || "right"}
        className="shadow-xs bg-background border-border m-2 flex flex-row items-center gap-2 border"
      >
        <span className="text-xs">{tooltip.title}</span>
        {tooltip.shortcut && <Shortcut shortcut={tooltip.shortcut} />}
      </TooltipContent>
    </Tooltip>
  );
};

export const TooltipWrapper = observer(TooltipWrapperComponent);
