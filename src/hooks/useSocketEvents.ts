import { useEffect } from "react";
import socketService from "../services/socket";
import { useChatStore } from "../stores/chatStore";
import { Message } from "../types";

export const useSocketEvents = () => {
  const {
    addMessage,
    updateMessageStatus,
    setUserOnline,
    setUserOffline,
    incrementUnread,
    activeConversationId,
  } = useChatStore();

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      addMessage(message);
      if (message.conversationId !== activeConversationId) {
        incrementUnread(message.conversationId);
      }
    };

    const handleMessageDelivered = (messageId: string) => {
      updateMessageStatus(messageId, "delivered");
    };

    const handleMessageRead = (messageId: string) => {
      updateMessageStatus(messageId, "read");
    };

    const handleUserOnline = (userId: string) => {
      setUserOnline(userId);
    };

    const handleUserOffline = (userId: string) => {
      setUserOffline(userId);
    };

    socketService.on("message:new", handleNewMessage);
    socketService.on("message:delivered", handleMessageDelivered);
    socketService.on("message:read", handleMessageRead);
    socketService.on("user:online", handleUserOnline);
    socketService.on("user:offline", handleUserOffline);

    return () => {
      socketService.off("message:new", handleNewMessage);
      socketService.off("message:delivered", handleMessageDelivered);
      socketService.off("message:read", handleMessageRead);
      socketService.off("user:online", handleUserOnline);
      socketService.off("user:offline", handleUserOffline);
    };
  }, [
    addMessage,
    updateMessageStatus,
    setUserOnline,
    setUserOffline,
    incrementUnread,
    activeConversationId,
  ]);
};
