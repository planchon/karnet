import { IconSend } from '@tabler/icons-react';
import { Button } from '@ui/button';
import { Shortcut } from '@ui/shortcut';
import { observer } from 'mobx-react';
import { Chat } from '@/components/chat';

export const ChatHomePage = observer(function ChatHomePageInside() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-auto w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100">
        <Chat.Root>
          <div className="h-full w-full rounded-b-xl bg-white p-2 shadow-md">
            <Chat.Input className="h-20" />
          </div>
          <div className="flex w-full justify-between p-2 py-0 pt-3 pl-1">
            <div className="flex items-center gap-0">
              <Chat.ModelSelect />
              <Chat.MCPSelect />
            </div>
            <div className="pb-2">
              <Button className="h-8 rounded-sm pr-[6px]! pl-[8px]!">
                <IconSend className="size-4" />
                Send
                <Shortcut nothen shortcut={['⌘', '↵']} />
              </Button>
            </div>
          </div>
        </Chat.Root>
      </div>
    </div>
  );
});
