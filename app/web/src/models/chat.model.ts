import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export class ChatModel extends AbstractModel {
  type = "chat" as const;

  messages: Message[] = [];

  constructor(props: Partial<ChatModel> & { id: string }) {
    super(props);

    makeObservable(this, {
      messages: observable,
    });

    this.load();

    reaction(
      () => this.toJSON(),
      () => {
        this.save();
      },
      {
        delay: 1000
      }
    );
  }

  getSmallId(id: number): string {
    return `CHAT-${id}`;
  }

  toJSON() {
    return {
      ...this
    };
  }

  _id(): string {
    return `p6n-chat-${this.id}`;
  }
}