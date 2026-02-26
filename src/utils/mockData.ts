import { Conversation, Message, User } from "../types";

// Mot de passe pour tous les users : "password123"
// Hash SHA-256 : ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
const DEFAULT_PASSWORD_HASH =
  "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f";

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "Alice",
    email: "alice@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    status: "online",
  },
  {
    id: "user-2",
    username: "Bob",
    email: "bob@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 95 * 24 * 60 * 60 * 1000,
    status: "offline",
  },
  {
    id: "user-3",
    username: "Charlie",
    email: "charlie@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    status: "away",
  },
  {
    id: "user-4",
    username: "David",
    email: "david@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    status: "online",
  },
  {
    id: "user-5",
    username: "Emma",
    email: "emma@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    status: "online",
  },
  {
    id: "user-6",
    username: "Frank",
    email: "frank@example.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
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
