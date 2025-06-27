import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { messagesResponseSchema } from '../schemas/messaging';
import imageCompression from 'browser-image-compression';

const MESSAGE_FETCH_LIMIT = 15

export const useMessages = (
    selectedConversation, 
    activeTab, 
    setConversations, 
    sortConversationsByLatestMessage
) => {
  const { currentUserId, sendMessage, registerMessageHandler } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const isInitialLoad = useRef(true);
  const lastFetchedOffset = useRef(-1);
  
  // Use refs to store current values to avoid callback recreation
  const selectedConversationRef = useRef(selectedConversation);
  const activeTabRef = useRef(activeTab);
  const setConversationsRef = useRef(setConversations);
  const sortConversationsByLatestMessageRef = useRef(sortConversationsByLatestMessage);
  
  // Update refs when values change
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);
  
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  
  useEffect(() => {
    setConversationsRef.current = setConversations;
  }, [setConversations]);
  
  useEffect(() => {
    sortConversationsByLatestMessageRef.current = sortConversationsByLatestMessage;
  }, [sortConversationsByLatestMessage]);

  const fetchMessages = useCallback(async (offset) => {
    if (!selectedConversationRef.current) {
      setMessages([]);
      return;
    }
    
    // Prevent duplicate API calls with the same offset
    if (lastFetchedOffset.current === offset) {
      return;
    }
    
    lastFetchedOffset.current = offset;
    
    if (isInitialLoad.current) {
      setIsMessagesLoading(true);
    } else {
      setIsLoadingOlder(true);
    }
    
    try {
      setMessagesError(null);
      const response = await fetch(`http://localhost:9999/backend/api/messages?conversationId=${selectedConversationRef.current.id}&offset=${offset}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      await messagesResponseSchema.validate(data);
      
      if (isInitialLoad.current) {
        // For initial load, replace all messages
        setMessages(data.messages || []);
      } else {
        // For loading older messages, prepend them to existing messages
        setMessages(prev => {
          const newMessages = [...(data.messages || []), ...prev];
          return newMessages;
        });
      }

      // If API returns fewer messages than requested, we've reached the end
      setHasMore(data.messages.length === MESSAGE_FETCH_LIMIT);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessagesError(err.message || 'Failed to load messages');
    } finally {
      if (isInitialLoad.current) {
        setIsMessagesLoading(false);
      } else {
        setIsLoadingOlder(false);
      }
    }
  }, [selectedConversation]); // Add selectedConversation as dependency to ensure fetchMessages updates when conversation changes

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const loadInitialMessages = async () => {
      setOffset(0);
      setHasMore(true);
      lastFetchedOffset.current = -1; // Reset for new conversation
      isInitialLoad.current = true; // Reset to true for new conversation
      await fetchMessages(0);
      isInitialLoad.current = false; // Set to false after first fetch completes
    };
    
    loadInitialMessages();
  }, [selectedConversation, fetchMessages]); // Include fetchMessages since it depends on selectedConversation

  // Split message handlers for better organization
  const handleIncomingUnsend = useCallback((payload) => {
    if (payload.action !== 'unsend') return;
    
    const { messageId } = payload;
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, content: 'This message has been deleted', isDeleted: true } : m
    ));
    setConversationsRef.current(prev => ({
      ...prev,
      [activeTabRef.current]: prev[activeTabRef.current].map(conv => {
        if (conv.latestMessage && conv.latestMessage.id === messageId) {
          return {
            ...conv,
            latestMessage: { ...conv.latestMessage, content: 'This message has been deleted' },
          };
        }
        return conv;
      }),
    }));
  }, []);

  const handleIncomingMessage = useCallback((payload) => {
    if (payload.action && payload.action !== 'send') return;
    
    const newMessage = payload.message;
    if (!newMessage) return;

    setConversationsRef.current(prev => ({
      ...prev,
      [activeTabRef.current]: sortConversationsByLatestMessageRef.current(
        prev[activeTabRef.current].map(conv =>
          conv.id === newMessage.conversationId ? { ...conv, latestMessage: newMessage } : conv
        )
      ),
    }));

    if (selectedConversationRef.current && newMessage.conversationId === selectedConversationRef.current.id) {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg.id === newMessage.id);
        if (messageExists) {
          return prev;
        }
        return [...prev, newMessage];
      });
    }
  }, []);

  // Register both message handlers
  useEffect(() => {
    const cleanup1 = registerMessageHandler(handleIncomingUnsend);
    const cleanup2 = registerMessageHandler(handleIncomingMessage);
    
    return () => {
      cleanup1();
      cleanup2();
    };
  }, [handleIncomingUnsend, handleIncomingMessage, registerMessageHandler]);

  const handleSendMessage = async (messageText, attachedFile) => {
    if ((!messageText || !messageText.trim()) && !attachedFile) return;
    if (!selectedConversationRef.current || !currentUserId) return;

    let media = null;
    if (attachedFile) {
      setIsUploading(true);
      try {
        let fileToUpload = attachedFile;
        if (attachedFile.type?.startsWith('image/')) {
          const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1024, useWebWorker: true };
          fileToUpload = await imageCompression(attachedFile, options);
        }
        
        const formData = new FormData();
        formData.append('file[]', fileToUpload);

        const uploadRes = await fetch('http://localhost:9999/backend/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.response?.length > 0) {
          media = {
            type: attachedFile.type?.startsWith('image/') ? 'image' : 'file',
            url: uploadData.response[0].url,
          };
        } else {
          console.error('Error uploading media:', uploadData.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Media upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }

    const messagePayload = {
      action: 'send',
      conversationId: selectedConversationRef.current.id,
      senderId: currentUserId,
      content: { text: messageText, media },
    };
    sendMessage(messagePayload);
  };

  const handleUnsendMessage = (messageId) => {
    sendMessage({
      action: 'unsend',
      messageId: messageId,
      currentUserId: currentUserId,
    });
  };

  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    
    // Use a small threshold (10px) to detect when user is near the top
    if (scrollTop <= 10 && hasMore && !isMessagesLoading && !isLoadingOlder && !isInitialLoad.current) {
      setOffset(prevOffset => {
        const nextOffset = prevOffset + MESSAGE_FETCH_LIMIT;
        fetchMessages(nextOffset);
        return nextOffset;
      });
    }
  }, [hasMore, isMessagesLoading, isLoadingOlder, offset, fetchMessages]);

  const loadOlderMessages = useCallback(() => {
    if (hasMore && !isMessagesLoading && !isLoadingOlder && !isInitialLoad.current) {
      setOffset(prevOffset => {
        const nextOffset = prevOffset + MESSAGE_FETCH_LIMIT;
        fetchMessages(nextOffset);
        return nextOffset;
      });
    }
  }, [hasMore, isMessagesLoading, isLoadingOlder, fetchMessages]);

  return {
    messages,
    isMessagesLoading,
    messagesError,
    isUploading,
    isLoadingOlder,
    handleSendMessage,
    handleScroll,
    loadOlderMessages,
    isInitialLoad,
    handleUnsendMessage
  };
}; 