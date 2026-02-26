import { create } from "zustand";
import { User, Message, Conversation } from "../types";

interface ChatState {
  conversations: Conversation[];
  archivedConversations: Conversation[];
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
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  archivedConversations: [],
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

  archiveConversation: (conversationId) =>
    set((state) => {
      const convToArchive = state.conversations.find(
        (conv) => conv.id === conversationId,
      );
      if (!convToArchive) return state;

      return {
        conversations: state.conversations.filter(
          (conv) => conv.id !== conversationId,
        ),
        archivedConversations: [...state.archivedConversations, convToArchive],
        activeConversationId:
          state.activeConversationId === conversationId
            ? null
            : state.activeConversationId,
      };
    }),

  unarchiveConversation: (conversationId) =>
    set((state) => {
      const convToUnarchive = state.archivedConversations.find(
        (conv) => conv.id === conversationId,
      );
      if (!convToUnarchive) return state;

      return {
        archivedConversations: state.archivedConversations.filter(
          (conv) => conv.id !== conversationId,
        ),
        conversations: [...state.conversations, convToUnarchive],
      };
    }),

  deleteConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (conv) => conv.id !== conversationId,
      ),
      archivedConversations: state.archivedConversations.filter(
        (conv) => conv.id !== conversationId,
      ),
      activeConversationId:
        state.activeConversationId === conversationId
          ? null
          : state.activeConversationId,
    })),
}));
