import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationsList = ({ conversations, loading, error, selectedConversation, onSelectConversation }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-sm text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="border-r border-gray-200 overflow-y-auto h-full">
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            onClick={() => onSelectConversation(conversation)}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No conversations found.</div>
      )}
    </div>
  );
};

export default ConversationsList;
