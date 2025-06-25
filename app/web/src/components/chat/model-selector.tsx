import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/primitive/ui/select";

export function ModelSelector() {
  return (
    <Select defaultValue="gpt-4o">
      <SelectTrigger className="border-none shadow-none">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="z-[1000]">
        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
        <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
      </SelectContent>
    </Select>
  );
}
