export default function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {/* ConversationList ici */}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Sélectionne une conversation
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* MessageList ici */}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          {/* MessageInput ici */}
        </div>
      </div>
    </div>
  );
}
