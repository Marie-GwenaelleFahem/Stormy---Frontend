import { Conversation, Message, User } from "../types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "Alice",
    status: "online",
  },
  {
    id: "user-2",
    username: "Bob",
    status: "offline",
  },
  {
    id: "user-3",
    username: "Charlie",
    status: "away",
  },
  {
    id: "user-4",
    username: "David",
    status: "online",
  },
  {
    id: "user-5",
    username: "Emma",
    status: "online",
  },
  {
    id: "user-6",
    username: "Frank",
    status: "offline",
  },
];

export const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      content: "Salut ! Comment ça va ?",
      timestamp: Date.now() - 3600000,
      status: "read",
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "current-user-id",
      content: "Ça va bien merci ! Et toi ?",
      timestamp: Date.now() - 3000000,
      status: "read",
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-1",
      content: "Nickel ! Tu codes quoi en ce moment ?",
      timestamp: Date.now() - 1800000,
      status: "read",
    },
  ],
  "conv-2": [
    {
      id: "msg-4",
      conversationId: "conv-2",
      senderId: "user-2",
      content: "T'as vu le dernier commit ?",
      timestamp: Date.now() - 7200000,
      status: "delivered",
    },
    {
      id: "msg-5",
      conversationId: "conv-2",
      senderId: "current-user-id",
      content: "Oui j'ai vu, bien joué !",
      timestamp: Date.now() - 6000000,
      status: "read",
    },
  ],
  "conv-3": [
    {
      id: "msg-6",
      conversationId: "conv-3",
      senderId: "user-3",
      content: "On se fait une review demain ?",
      timestamp: Date.now() - 900000,
      status: "sent",
    },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [mockUsers[0]],
    lastMessage: mockMessages["conv-1"][2],
    unreadCount: 0,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: "conv-2",
    participants: [mockUsers[1]],
    lastMessage: mockMessages["conv-2"][1],
    unreadCount: 0,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 6000000,
  },
  {
    id: "conv-3",
    participants: [mockUsers[2]],
    lastMessage: mockMessages["conv-3"][0],
    unreadCount: 1,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 900000,
  },
];
