import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@ui/sidebar";
import { useMutation } from "convex/react";
import { TrashIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export const MAX_TITLE_LENGTH = 35;

export const ChatListItem = ({ chat }: { chat: Doc<"chats"> }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const deleteChat = useMutation(api.functions.chat.deleteChat);

    return (
        <Link
            className={cn(
                "group/item relative max-w-full truncate rounded-sm px-2 py-2 text-sm hover:cursor-pointer hover:bg-accent",
                location.pathname.includes(`/chat/${chat.chat_id}`) ? "bg-accent font-normal" : ""
            )}
            key={chat.chat_id}
            to={`/chat/${chat.chat_id}`}
        >
            <div className="absolute top-[6px] right-[-16px] opacity-0 transition-all duration-200 group-hover/item:right-[6px] group-hover/item:opacity-100">
                <Button
                    className="z-50 size-6 rounded-sm"
                    onClick={(e) => {
                        if (location.pathname.includes(`/chat/${chat.chat_id}`)) {
                            navigate("/chat");
                        }
                        deleteChat({ id: chat.chat_id });
                        toast.success("Chat deleted");
                        e.preventDefault();
                    }}
                    size="icon"
                    variant="outline"
                >
                    <TrashIcon className="size-3" />
                </Button>
            </div>
            {chat.title}
        </Link>
    );
};

export const ChatSidebar = observer(function ChatSidebarInner() {
    const { data: oldChat, isLoading } = useQuery({
        ...convexQuery(api.functions.chat.getLastChats, {
            limit: 50,
        }),
        initialData: JSON.parse(localStorage.getItem("chats-history") || "[]"),
    });

    useEffect(() => {
        if (oldChat) {
            localStorage.setItem("chats-history", JSON.stringify(oldChat));
        }
    }, [oldChat]);

    if (!oldChat || isLoading || oldChat.length === 0) {
        return null;
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarGroupLabel className="flex items-center gap-2">History</SidebarGroupLabel>
                <div className="h-[calc(100vh-150px)] w-full overscroll-none">
                    <div className="no-scrollbar flex flex-col gap-1 overflow-hidden">
                        {oldChat.map((chat) => (
                            <ChatListItem chat={chat} key={chat._id} />
                        ))}
                    </div>
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    );
});
