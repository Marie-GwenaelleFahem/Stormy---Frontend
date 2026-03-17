import { useState } from "react";
import { User } from "../types";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
}

export default function NewConversationModal({
  isOpen,
  onClose,
  availableUsers,
  onSelectUser,
}: NewConversationModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Nouvelle conversation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un contact..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-4"
          autoFocus
        />

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun contact trouvé
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {user.username}
                  </h4>
                  <span
                    className={`text-xs ${
                      user.status === "online"
                        ? "text-green-500"
                        : user.status === "away"
                          ? "text-yellow-500"
                          : "text-gray-400"
                    }`}
                  >
                    {user.status === "online"
                      ? "En ligne"
                      : user.status === "away"
                        ? "Absent"
                        : "Hors ligne"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
