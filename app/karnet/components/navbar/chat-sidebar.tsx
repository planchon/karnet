import { IconMessageCircle } from '@tabler/icons-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@ui/sidebar';
import { usePaginatedQuery } from 'convex/react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';

export const ChatSidebar = observer(function ChatSidebarInner() {
    const oldChat = usePaginatedQuery(
        api.functions.chat.getLastChats,
        {
            paginationOpts: {
                limit: 10,
            },
        },
        {
            initialNumItems: 10,
        }
    );

    if (oldChat.results.length === 0 || oldChat.isLoading) {
        return null;
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarGroupLabel className="flex items-center gap-2">History</SidebarGroupLabel>
                <div className="flex max-h-[500px] flex-col gap-2 overflow-y-hidden px-1">
                    {oldChat.results.map((chat) => (
                        <Link
                            className="text-nowrap rounded-xs px-1 py-1 text-sm hover:cursor-pointer hover:bg-accent"
                            href={`/chat/${chat._id}`}
                            key={chat._id}
                        >
                            {chat.title}
                        </Link>
                    ))}
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    );
});
