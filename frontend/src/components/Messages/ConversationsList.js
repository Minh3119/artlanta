import React from 'react';
import ConversationItem from './ConversationItem';
import { Archive, MessageCircle, Clock } from 'lucide-react';

const ConversationsList = ({ 
  conversations,
  type,
  searchQuery,
  loading,
  error,
  selectedConversation,
  onSelectConversation,
  onArchive,
  onUnarchive,
  onAccept,
  onDecline 
}) => {
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredConversations.length === 0) {
    const getEmptyState = () => {
      switch (type) {
        case 'chat':
          return { icon: MessageCircle, message: 'No conversations found' };
        case 'pending':
          return { icon: Clock, message: 'No pending requests' };
        case 'archive':
          return { icon: Archive, message: 'No archived conversations' };
        default:
          return { icon: MessageCircle, message: 'No conversations found' };
      }
    };
    
    const { icon: EmptyIcon, message } = getEmptyState();
    
    return (
      <div className="p-8 text-center text-gray-500">
        <EmptyIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>{message}</p>
      </div>
    );
  }


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

  // return (
  //   <div className="border-r border-gray-200 overflow-y-auto h-full">
  //     {conversations.length > 0 ? (
  //       conversations.map((conversation) => (
  //         <ConversationItem
  //           key={conversation.id}
  //           conversation={conversation}
  //           isSelected={selectedConversation?.id === conversation.id}
  //           onClick={() => onSelectConversation(conversation)}
  //         />
  //       ))
  //     ) : (
  //       <div className="p-4 text-center text-gray-500">No conversations found.</div>
  //     )}
  //   </div>
  // );

  return (
    <div>
      {filteredConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          type={type}
          isSelected={selectedConversation?.id === conversation.id}
          onClick={onSelectConversation(conversation)}
          onAccept={onAccept}
          onDecline={onDecline}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
