import { Conversation } from "../types";
import ConversationMenu from "./ConversationMenu";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isArchived?: boolean;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
  onArchive,
  onDelete,
  isArchived = false,
}: ConversationItemProps) {
  const otherUser = conversation.participants[0];

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 ${
        isActive ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          {otherUser.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherUser.username}
            </h3>
            <div className="flex items-center space-x-2">
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500">
                  {new Date(
                    conversation.lastMessage.timestamp,
                  ).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <ConversationMenu
                onArchive={onArchive}
                onDelete={onDelete}
                isArchived={isArchived}
              />
            </div>
          </div>
          {conversation.lastMessage && (
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage.content}
            </p>
          )}
          {conversation.unreadCount > 0 && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-primary rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
