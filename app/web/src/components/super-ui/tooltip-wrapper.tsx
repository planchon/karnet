import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Shortcut } from "../ui/shortcut";

type SuperUITooltipWrapperProps = {
  children: React.ReactNode;
  tooltip: {
    title: string;
    side?: "top" | "right" | "bottom" | "left";
    shortcut?: string[];
  };
};

export const TooltipWrapper = ({
  children,
  tooltip
}: SuperUITooltipWrapperProps) => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger className="w-[calc(100%-8px)]">{children}</TooltipTrigger>
      <TooltipContent
        side={tooltip.side || "right"}
        className="shadow-xs m-2 flex flex-row items-center gap-2"
      >
        <span className="text-xs">{tooltip.title}</span>
        {tooltip.shortcut && <Shortcut shortcut={tooltip.shortcut} />}
      </TooltipContent>
    </Tooltip>
  );
};
