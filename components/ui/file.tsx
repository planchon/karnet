import { convexQuery } from "@convex-dev/react-query";
import { IconFileTypeDocx, IconFileTypeXls, IconPdf } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import type { FileUIPart } from "ai";
import { Ban, FileText, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export type FileWithUploadProcess = {
    file: File;
} & ({ upload: "in_progress" | "error" } | { upload: "success"; id: string; url: string });

type FileProps = {
    file: FileWithUploadProcess;
    onRemove: () => void;
};

export const _FileExtensions = {
    pdf: "pdf",
    doc: "doc",
    docx: "docx",
    xls: "xls",
    xlsx: "xlsx",
    "application/pdf": "pdf",
} as const;

export const _ImageExtensions = {
    webp: "webp",
    jpg: "jpg",
    jpeg: "jpeg",
    png: "png",
    gif: "gif",
    "image/webp": "webp",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/gif": "gif",
} as const;

type FileExtension = keyof typeof _FileExtensions;

export const FileIcon = ({ fileExtension }: { fileExtension: FileExtension | string }) => {
    switch (fileExtension) {
        case "pdf":
        case "application/pdf":
            return <IconPdf className="size-5" />;
        case "doc":
            return <IconFileTypeDocx className="size-5" />;
        case "docx":
            return <IconFileTypeDocx className="size-5" />;
        case "xls":
            return <IconFileTypeXls className="size-5" />;
        case "xlsx":
            return <IconFileTypeXls className="size-5" />;
        default:
            return <FileText className="size-4" />;
    }
};

export const File = ({ file, onRemove }: FileProps) => {
    const fileExtension = file.file.name.split(".").pop()?.toLowerCase() || "";

    const isImage = Object.keys(_ImageExtensions).includes(fileExtension);

    const tooltipText = file.upload === "in_progress" ? "Stop upload" : "Remove";

    return (
        <div
            className={cn(
                "group relative flex h-10 w-fit select-none items-center gap-2 rounded-md border text-gray-600 text-sm",
                isImage && "bg-transparent p-0",
                !isImage && "bg-gray-100 px-3"
            )}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="absolute top-[-5px] right-[-5px] cursor-pointer rounded-full bg-gray-500 p-1 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {file.upload === "success" && <X className="size-2" onClick={onRemove} />}
                        {file.upload === "in_progress" && <Ban className="size-2" onClick={onRemove} />}
                        {file.upload === "error" && <X className="size-2" onClick={onRemove} />}
                    </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                    <span>
                        {tooltipText} {file.file.name}
                    </span>
                </TooltipContent>
            </Tooltip>
            {isImage && (
                <picture className="size-10 overflow-hidden rounded-md border bg-muted object-cover">
                    <img alt={file.file.name} height={40} src={URL.createObjectURL(file.file)} width={40} />
                </picture>
            )}
            {!isImage && (
                <>
                    <FileIcon fileExtension={fileExtension} />
                    <span className="truncate">{file.file.name}</span>
                </>
            )}
        </div>
    );
};

export const FilePreview = ({ filePart }: { filePart: FileUIPart }) => {
    const file_id = filePart.providerMetadata?.karnet?.file_id as Id<"files">;
    const {
        data: file,
        isLoading,
        isError,
    } = useQuery({
        ...convexQuery(api.functions.files.getFile, { id: file_id }),
    });

    if (isLoading) {
        return <div>loading</div>;
    }

    if (isError) {
        return <div>error</div>;
    }

    if (!file) {
        return <div>no file</div>;
    }

    const isImage = Object.keys(_ImageExtensions).includes(file.media_type);

    return (
        <div
            className={cn(
                "group relative flex h-10 w-fit select-none items-center gap-2 rounded-md border bg-gray-50 text-gray-600 text-sm",
                isImage && "bg-transparent p-0",
                !isImage && "px-3"
            )}
        >
            {isImage && (
                <a className="flex items-center gap-2" href={file.url} rel="noopener noreferrer" target="_blank">
                    <picture>
                        <img
                            alt={file.filename}
                            className="rounded-md border bg-muted object-cover"
                            height={40}
                            src={file.url}
                            width={40}
                        />
                    </picture>
                </a>
            )}
            {!isImage && (
                <a className="flex items-center gap-2" href={file.url} rel="noopener noreferrer" target="_blank">
                    <FileIcon fileExtension={file.media_type} />
                    <span className="truncate">{file.filename}</span>
                </a>
            )}
        </div>
    );
};
