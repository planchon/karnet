import { useSnapshot } from "valtio";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { commandEventsStore, toggleCreateEventEvents } from "@/stores/commands";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandMinecraft
} from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useShortcut } from "@/hooks/useShortcut";

export const CreateEventCommand = () => {
  const open = useSnapshot(commandEventsStore).eventOpen;

  useShortcut("c+a", () => {
    toggleCreateEventEvents();
  });

  return (
    <Dialog open={open} onOpenChange={toggleCreateEventEvents}>
      <DialogContent className="z-[1000] min-w-[700px] p-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2">
            <Select defaultValue="google">
              <SelectTrigger
                size="sm"
                className="shadow-none"
                showChevron={false}
              >
                <SelectValue className="text-xs" placeholder="Google" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">
                  <IconBrandGoogle />
                  Google
                </SelectItem>
                <SelectItem value="outlook">
                  <IconBrandMinecraft />
                  Outlook
                </SelectItem>
                <SelectItem value="apple">
                  <IconBrandApple />
                  Apple
                </SelectItem>
              </SelectContent>
            </Select>
            <ChevronRight className="size-3" />
            <span className="font-regular text-xs">New event</span>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Event name"
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled min-h-[20px] w-full resize-none bg-transparent text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              multiple={true}
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled w-full resize-none bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
