import { generateId } from '@/lib/utils';
import { ChatModel } from '@/models/chat.model';
import { AbstractStore } from './abstract.store';

const ALL_CHATS_KEY = 'p6n-all-chats';

type UserChatInput = {
  content: string;
  model: string;
};

export class ChatStore extends AbstractStore<ChatModel> {
  store_key = ALL_CHATS_KEY;
  store_name = 'chat';
  smallId = 'CHAT';

  loadInMemory(id: string | undefined): ChatModel {
    if (id === undefined) {
      throw new Error('Id is undefined');
    }
    return new ChatModel({ id });
  }

  createNewModel(id: string): ChatModel {
    const chat = new ChatModel({ id });
    chat.save();
    this.setModel(id, chat);
    this.save();
    return chat;
  }

  createNewChat(input: UserChatInput) {
    const chat = this.createNewModel(generateId());
    chat.messages.push({
      role: 'user',
      content: input.content,
    });
    chat.save();
    this.save();
    return chat;
  }
}
