import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@ui/sidebar';
import { usePaginatedQuery } from 'convex/react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

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

    const location = usePathname();

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
                            className={cn(
                                'text-nowrap rounded-xs px-1 py-1 text-sm hover:cursor-pointer hover:bg-accent',
                                location.includes(`/chat/${chat._id}`) ? 'bg-accent font-normal' : ''
                            )}
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
