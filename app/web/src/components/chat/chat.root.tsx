import { cn } from "@/lib/utils";
import { observer } from "mobx-react";

type ChatRootProps = React.ComponentProps<"div">;

export const ChatRoot = observer(function ChatRoot({
  children,
  className,
  ...props
}: ChatRootProps) {
  return (
    <div
      className={cn(
        "h-full w-full rounded-t-lg border border-b-0 bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
