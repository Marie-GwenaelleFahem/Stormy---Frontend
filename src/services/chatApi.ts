import api from "./api";
import { Conversation, Message } from "../types";

export const chatApi = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>("/conversations");
    return response.data;
  },

  getConversation: async (id: string) => {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  getMessages: async (conversationId: string, limit = 50, offset = 0) => {
    const response = await api.get<Message[]>(
      `/conversations/${conversationId}/messages`,
      {
        params: { limit, offset },
      },
    );
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post<Message>(
      `/conversations/${conversationId}/messages`,
      { content },
    );
    return response.data;
  },

  markAsRead: async (conversationId: string, messageIds: string[]) => {
    await api.post(`/conversations/${conversationId}/read`, { messageIds });
  },

  createConversation: async (participantIds: string[]) => {
    const response = await api.post<Conversation>("/conversations", {
      participantIds,
    });
    return response.data;
  },

  deleteConversation: async (id: string) => {
    await api.delete(`/conversations/${id}`);
  },
};
