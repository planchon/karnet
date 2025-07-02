import message4 from "@/mocks/message4.md?raw";
import message2 from "@/mocks/message2.md?raw";

export const messages = [
  {
    id: "1",
    sender: "user" as const,
    content: "create a markdown text showing all the features",
    timestamp: new Date()
  },
  {
    id: "2",
    sender: "assistant" as const,
    content: message2,
    timestamp: new Date()
  },
  {
    id: "3",
    sender: "user" as const,
    content: "create a markdown text showing all the features",
    timestamp: new Date()
  },
  {
    id: "4",
    sender: "assistant" as const,
    content: message4,
    timestamp: new Date()
  }
];
