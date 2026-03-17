import api from "./api";
import { User } from "../types";

export const membersApi = {
  getMembers: async (conversationId: string) => {
    const response = await api.get<User[]>(
      `/messages/conversations/${conversationId}/members`,
    );
    return response.data;
  },

  addMember: async (conversationId: string, userId: string) => {
    const response = await api.post<User>(
      `/messages/conversations/${conversationId}/members`,
      { userId },
    );
    return response.data;
  },

  removeMember: async (conversationId: string, userIdToRemove: string) => {
    await api.delete(
      `/messages/conversations/${conversationId}/members/${userIdToRemove}`,
    );
  },
};
