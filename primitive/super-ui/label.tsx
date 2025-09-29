import { observer } from "mobx-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/primitive/ui/tooltip";

type LabelProps = {
    label: string;
    icon: React.ElementType;
    tooltip?: string;
    className?: string;
};

export const Label = observer(function LabelInner({ label, icon: Icon, className, tooltip }: LabelProps) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={cn(
                        "flex select-none flex-row items-center gap-1 rounded-full border py-1 pr-3 pl-2 shadow-xs",
                        className
                    )}
                >
                    <Icon className="size-4 text-gray-500" />
                    <span className="font-medium text-gray-500 text-xs">{label}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent className="m-1" side="bottom">
                <span className="font-medium text-gray-500 text-xs">{tooltip ?? label}</span>
            </TooltipContent>
        </Tooltip>
    );
});
