import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Shortcut } from "../ui/shortcut";
import { useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";

type SuperUITooltipWrapperProps = {
  children: React.ReactNode;
  tooltip: {
    title: string;
    side?: "top" | "right" | "bottom" | "left";
    shortcut?: string[];
  };
};

const TooltipWrapperComponent = ({
  children,
  tooltip
}: SuperUITooltipWrapperProps) => {
  const { settingsStore } = useStores();

  return (
    <Tooltip>
      <TooltipTrigger className="w-[calc(100%-8px)]">{children}</TooltipTrigger>
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
