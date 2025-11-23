import { FaFile } from "react-icons/fa";
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
        description: "Add search results to your message",
        icon: MdOutlineSearch,
    },
    {
        id: "image",
        name: "Image Generation",
        description: "Generate images using AI",
        icon: RiImageCircleAiFill,
    },
    {
        id: "ocr",
        name: "Mistral OCR",
        description: "Use Mistral OCR",
        icon: LuScanText,
    },
    {
        id: "file",
        name: "File upload",
        description: "Upload files to your message",
        icon: FaFile,
    },
];
