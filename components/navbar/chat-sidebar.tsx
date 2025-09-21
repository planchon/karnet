import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@ui/sidebar";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export const ChatSidebar = observer(function ChatSidebarInner() {
    const { data: oldChat, isLoading } = useQuery({
        ...convexQuery(api.functions.chat.getLastChats, {
            limit: 10,
        }),
        initialData: JSON.parse(localStorage.getItem("chats-history") || "[]"),
    });

    useEffect(() => {
        if (oldChat) {
            localStorage.setItem("chats-history", JSON.stringify(oldChat));
        }
    }, [oldChat]);

    const location = useLocation();

    if (!oldChat || isLoading || oldChat.length === 0) {
        return null;
    }

    console.log(oldChat);

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarGroupLabel className="flex items-center gap-2">History</SidebarGroupLabel>
                <div className="flex max-h-[500px] flex-col gap-2 overflow-x-hidden overflow-y-hidden px-1">
                    {oldChat.map((chat) => (
                        <Link
                            className={cn(
                                "max-w-full text-ellipsis whitespace-nowrap rounded-xs px-1 py-1 text-sm hover:cursor-pointer hover:bg-accent",
                                location.pathname.includes(`/chat/${chat._id}`) ? "bg-accent font-normal" : ""
                            )}
                            key={chat._id}
                            to={`/chat/${chat._id}`}
                        >
                            {chat.title}
                        </Link>
                    ))}
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    );
});
