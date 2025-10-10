import { LuScanText } from "react-icons/lu";
import { MdOutlineSearch } from "react-icons/md";
import { RiImageCircleAiFill } from "react-icons/ri";
import type { ChatMessageBody } from "./schema/chat";

type Command = {
    id: ChatMessageBody["tools"][number];
    name: string;
    description: string;
    icon: React.ElementType;
};

export const commands: Command[] = [
    {
        id: "web",
        name: "Search",
        description: "Search the web",
        icon: MdOutlineSearch,
    },
    {
        id: "image",
        name: "Image Generation",
        description: "Generate AI Images",
        icon: RiImageCircleAiFill,
    },
    {
        id: "ocr",
        name: "Mistral OCR",
        description: "Use the best OCR model",
        icon: LuScanText,
    },
];
