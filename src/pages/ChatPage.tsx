import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import ConversationItem from "../components/ConversationItem";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import NewConversationModal from "../components/NewConversationModal";
import { mockConversations, mockMessages, mockUsers } from "../utils/mockData";
import { User, Conversation } from "../types";

export default function ChatPage() {
  const {
    conversations,
    archivedConversations,
    activeConversationId,
    messages,
    setActiveConversation,
    setConversations,
    setMessages,
    addMessage,
    archiveConversation,
    unarchiveConversation,
    deleteConversation,
  } = useChatStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversations(mockConversations);
    Object.entries(mockMessages).forEach(([convId, msgs]) => {
      setMessages(convId, msgs);
    });
  }, [setConversations, setMessages]);

  const currentMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: "current-user-id",
      content,
      timestamp: Date.now(),
      status: "sent" as const,
    };

    addMessage(newMessage);
  };

  const handleCreateConversation = (user: User) => {
    const existingConv = conversations.find((conv) =>
      conv.participants.some((p) => p.id === user.id),
    );

    if (existingConv) {
      setActiveConversation(existingConv.id);
      return;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [user],
      unreadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation.id);
  };

  const availableUsers = mockUsers.filter(
    (user) =>
      !conversations.some((conv) =>
        conv.participants.some((p) => p.id === user.id),
      ),
  );

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/3 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
              >
                + Nouveau
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowArchived(false)}
                className={`flex-1 py-1 text-sm rounded ${
                  !showArchived
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Actives ({conversations.length})
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`flex-1 py-1 text-sm rounded ${
                  showArchived
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Archivées ({archivedConversations.length})
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-121px)]">
            {(showArchived ? archivedConversations : conversations).length ===
            0 ? (
              <div className="p-4 text-center text-gray-500">
                {showArchived
                  ? "Aucune conversation archivée"
                  : "Aucune conversation"}
              </div>
            ) : (
              (showArchived ? archivedConversations : conversations).map(
                (conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConversationId}
                    onClick={() => setActiveConversation(conv.id)}
                    onArchive={() =>
                      showArchived
                        ? unarchiveConversation(conv.id)
                        : archiveConversation(conv.id)
                    }
                    onDelete={() => {
                      if (
                        window.confirm(
                          "Êtes-vous sûr de vouloir supprimer cette conversation ?",
                        )
                      ) {
                        deleteConversation(conv.id);
                      }
                    }}
                    isArchived={showArchived}
                  />
                ),
              )
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeConversation
                ? activeConversation.participants[0].username
                : "Sélectionne une conversation"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {currentMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Aucun message
              </div>
            ) : (
              <>
                {currentMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === "current-user-id"}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <MessageInput
              onSend={handleSendMessage}
              disabled={!activeConversationId}
            />
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableUsers={availableUsers}
        onSelectUser={handleCreateConversation}
      />
    </>
  );
}
