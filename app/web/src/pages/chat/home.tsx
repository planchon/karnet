import { IconSend } from '@tabler/icons-react';
import { Button } from '@ui/button';
import { Shortcut } from '@ui/shortcut';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Chat } from '@/components/chat';
import { useShortcut } from '@/hooks/useShortcut';
import { useStores } from '@/hooks/useStores';

export const ChatHomePage = observer(function ChatHomePageInside() {
  const { chatStore } = useStores();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [inputPosition, setInputPosition] = useState<'center' | 'bottom'>(
    id ? 'bottom' : 'center'
  );

  // i want to keep the animation when im on the chat page
  useEffect(() => {
    if (location.pathname === '/chat') {
      setInputPosition('center');
    }
  }, [location.pathname]);

  const onSend = () => {
    const chat = chatStore.createNewChat({
      content: 'Hello, how are you?',
      model: 'gpt-4o',
    });
    setInputPosition('bottom');
    navigate(`/chat/${chat.id}`, {
      replace: false,
    });
  };

  useShortcut('Control+Enter', onSend);
  useShortcut('Command+Enter', onSend);

  return (
    <div
      className="flex h-full w-full flex-col items-center"
      style={{
        justifyContent: inputPosition === 'center' ? 'center' : 'flex-end',
        paddingBottom: inputPosition === 'center' ? '0px' : '12px',
      }}
    >
      <motion.div
        className="w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100"
        layout
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
      >
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
              <Button
                className="h-8 rounded-sm pr-[6px]! pl-[8px]!"
                onClick={onSend}
              >
                <IconSend className="size-4" />
                Send
                <Shortcut nothen shortcut={['⌘', '↵']} />
              </Button>
            </div>
          </div>
        </Chat.Root>
      </motion.div>
    </div>
  );
});
