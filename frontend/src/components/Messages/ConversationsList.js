import React, { useState, useEffect } from 'react';
import { conversationsResponseSchema } from '../../schemas/messaging';
import ConversationItem from './ConversationItem';

const ConversationsList = ({ selectedConversation, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9999/backend/api/conversations', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate response against schema
        await conversationsResponseSchema.validate(data);
        
        setConversations(data.conversations || []);
        
        // If there are conversations and no selected conversation, select the first one
        if (data.conversations?.length > 0 && !selectedConversation) {
          onSelectConversation(data.conversations[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [onSelectConversation, selectedConversation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No conversations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-64px)]">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedConversation?.id === conversation.id}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
