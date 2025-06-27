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

  const fetchMessages = useCallback(async (offset) => {
    console.log(`Fetching messages with offset=${offset}}`)
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    
    // Prevent duplicate API calls with the same offset
    if (lastFetchedOffset.current === offset) {
      return;
    }
    
    console.log('fetchMessages called - offset:', offset, 'isInitialLoad:', isInitialLoad.current);
    lastFetchedOffset.current = offset;
    
    if (isInitialLoad.current) {
      setIsMessagesLoading(true);
    } else {
      setIsLoadingOlder(true);
    }
    
    try {
      setMessagesError(null);
      const response = await fetch(`http://localhost:9999/backend/api/messages?conversationId=${selectedConversation.id}&offset=${offset}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      await messagesResponseSchema.validate(data);
      
      console.log('Messages received:', data.messages?.length || 0, 'messages');
      
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
  }, [selectedConversation]);

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
  }, [selectedConversation, fetchMessages]);

  const handleOnMessage = useCallback((payload) => {
    if (payload.action === 'unsend') {
      const { messageId } = payload;
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, content: 'This message has been deleted', isDeleted: true } : m
      ));
      setConversations(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(conv => {
          if (conv.latestMessage && conv.latestMessage.id === messageId) {
            return {
              ...conv,
              latestMessage: { ...conv.latestMessage, content: 'This message has been deleted' },
            };
          }
          return conv;
        }),
      }));
    } else if (!payload.action || payload.action === 'send') {
      const newMessage = payload.message;
      if (!newMessage) return;

      setConversations(prev => ({
        ...prev,
        [activeTab]: sortConversationsByLatestMessage(
          prev[activeTab].map(conv =>
            conv.id === newMessage.conversationId ? { ...conv, latestMessage: newMessage } : conv
          )
        ),
      }));

      if (selectedConversation && newMessage.conversationId === selectedConversation.id) {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => msg.id === newMessage.id);
          if (messageExists) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    }
  }, [selectedConversation, activeTab, setConversations, sortConversationsByLatestMessage]);

  useEffect(() => {
    const cleanup = registerMessageHandler(handleOnMessage);
    return cleanup;
  }, [handleOnMessage, registerMessageHandler]);

  const handleSendMessage = async (messageText, attachedFile) => {
    if ((!messageText || !messageText.trim()) && !attachedFile) return;
    if (!selectedConversation || !currentUserId) return;

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
      conversationId: selectedConversation.id,
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
    handleUnsendMessage,
    handleScroll,
    loadOlderMessages,
    isInitialLoad
  };
}; 