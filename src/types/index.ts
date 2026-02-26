export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file";
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface SocketEvents {
  "message:new": (message: Message) => void;
  "message:delivered": (messageId: string) => void;
  "message:read": (messageId: string) => void;
  "user:online": (userId: string) => void;
  "user:offline": (userId: string) => void;
  "user:typing": (data: { userId: string; conversationId: string }) => void;
  "conversation:new": (conversation: Conversation) => void;
}
