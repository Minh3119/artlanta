import { useState, useEffect, useCallback } from 'react';

// Utility function to sort conversations by latest message CreatedAt (newest first)
const sortConversationsByLatestMessage = (conversations) => {
  return [...conversations].sort((a, b) => {
    const msgA = a.latestMessage;
    const msgB = b.latestMessage;
    
    if ((!msgA || !msgA.createdAt) && (!msgB || !msgB.createdAt)) return 0;
    if (!msgA || !msgA.createdAt) return 1;
    if (!msgB || !msgB.createdAt) return -1;
    
    const dateA = new Date(msgA.createdAt).getTime();
    const dateB = new Date(msgB.createdAt).getTime();
    
    return dateB - dateA;
  });
};

export const useConversations = () => {
  const [conversations, setConversations] = useState({
    chat: [],
    pending: [],
    archived: []
  });
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConversations = useCallback(async (type) => {
    setLoadingConversations(true);
    try {
      const response = await fetch(`http://localhost:9999/backend/api/conversations?type=${type}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} conversations`);
      }
      const data = await response.json();
      const sortedData = sortConversationsByLatestMessage(data.conversations || []);
      
      setConversations(prev => ({
        ...prev,
        [type]: sortedData
      }));
    } catch (err) {
      setConversationsError(err.message);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    const loadAllConversations = async () => {
      await Promise.all([
        fetchConversations('chat'),
        fetchConversations('pending'),
        fetchConversations('archived')
      ]);
    };
    
    loadAllConversations();
  }, [fetchConversations]);
  
  // Re-fetch when activeTab changes
  useEffect(() => {
    fetchConversations(activeTab);
  }, [activeTab, fetchConversations]);

  const handleAcceptRequest = (id) => {
    console.log('Accepting request:', id);
    fetchConversations('pending');
  };

  const handleDeclineRequest = (id) => {
    console.log('Declining request:', id);
    fetchConversations('pending');
  };

  const handleArchiveConversation = (id) => {
    console.log('Archiving conversation:', id);
    fetchConversations('chat');
    fetchConversations('archived');
  };

  const handleUnarchiveConversation = (id) => {
    console.log('Unarchiving conversation:', id);
    fetchConversations('archived');
    fetchConversations('chat');
  };

  const getCurrentConversations = useCallback(() => {
    return conversations[activeTab] || [];
  }, [conversations, activeTab]);

  const getConversationCount = useCallback((type) => {
    return conversations[type]?.length || 0;
  }, [conversations]);

  return {
    conversations,
    setConversations,
    loadingConversations,
    conversationsError,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleAcceptRequest,
    handleDeclineRequest,
    handleArchiveConversation,
    handleUnarchiveConversation,
    getCurrentConversations,
    getConversationCount,
    sortConversationsByLatestMessage,
  };
}; 