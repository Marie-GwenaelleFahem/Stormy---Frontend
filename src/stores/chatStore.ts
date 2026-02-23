import { create } from "zustand";
import { User, Message, Conversation } from "../types";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  users: User[];
  onlineUsers: Set<string>;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  setUsers: (users: User[]) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  updateMessageStatus: (
    messageId: string,
    status: "sent" | "delivered" | "read",
  ) => void;
  incrementUnread: (conversationId: string) => void;
  resetUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  users: [],
  onlineUsers: new Set(),

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().resetUnread(id);
    }
  },

  addMessage: (message) =>
    set((state) => {
      const conversationMessages = state.messages[message.conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [message.conversationId]: [...conversationMessages, message],
        },
      };
    }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  setUsers: (users) => set({ users }),

  setUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),

  setUserOffline: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),

  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const updatedMessages = { ...state.messages };
      Object.keys(updatedMessages).forEach((convId) => {
        updatedMessages[convId] = updatedMessages[convId].map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg,
        );
      });
      return { messages: updatedMessages };
    }),

  incrementUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, unreadCount: conv.unreadCount + 1 }
          : conv,
      ),
    })),

  resetUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),
}));
