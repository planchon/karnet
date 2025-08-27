import {
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
} from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip';

export const Priority = ({ priority }: { priority: number | null }) => {
  const icon = () => {
    switch (priority) {
      case 1:
        return <IconAntennaBars5 className="size-4 text-accent-foreground" />;
      case 2:
        return <IconAntennaBars4 className="size-4 text-accent-foreground" />;
      case 3:
        return <IconAntennaBars3 className="size-4 text-accent-foreground" />;
      case 4:
        return <IconAntennaBars2 className="size-4 text-accent-foreground" />;
      default:
        return <IconAntennaBars1 className="size-4 text-accent-foreground" />;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>{icon()}</TooltipTrigger>
      <TooltipContent>Priority {priority}</TooltipContent>
    </Tooltip>
  );
};
