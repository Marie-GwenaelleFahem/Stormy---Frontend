import api from "./api";
import { Conversation, Message } from "../types";

export const chatApi = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>(
      "/messages/users/conversations",
    );
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get<Message[]>(
      `/messages/conversation/${conversationId}`,
    );
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post<Message>("/messages", {
      conversationId,
      content,
    });
    return response.data;
  },

  createConversation: async (participantIds: string[]) => {
    const response = await api.post<Conversation>("/messages/conversations", {
      participantIds,
    });
    return response.data;
  },

  updateConversation: async (
    conversationId: string,
    data: Partial<Conversation>,
  ) => {
    const response = await api.put<Conversation>(
      `/messages/conversations/${conversationId}`,
      data,
    );
    return response.data;
  },

  deleteConversation: async (id: string) => {
    await api.delete(`/messages/conversations/${id}`);
  },

  updateMessage: async (messageId: string, content: string) => {
    const response = await api.put<Message>(`/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  deleteMessage: async (messageId: string) => {
    await api.delete(`/messages/${messageId}`);
  },
};
