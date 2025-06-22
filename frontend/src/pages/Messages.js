import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import ConversationsList from '../components/Messages/ConversationsList';
import MessagesList from '../components/Messages/MessagesList';
import LoadingScreen from '../components/common/LoadingScreen';
import { messagesResponseSchema } from '../schemas/messaging';

const MessagesPage = () => {
  const ws = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Effect for fetching conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const response = await fetch('http://localhost:9999/backend/api/conversations', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (err) {
        setConversationsError(err.message);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  // Effect for selecting the first conversation
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOnMessage = useCallback((event) => {
    try {
      const payload = JSON.parse(event.data);

      // Handle unsend action broadcast
      if (payload.action === 'unsend') {
        const { messageId } = payload;
        // Remove from messages list if currently selected conversation contains it
        setMessages(prev => prev.filter(m => m.id !== messageId));

        // Update conversations list (if latestMessage is the one unsent, clear it)
        setConversations(prev => prev.map(conv => {
          if (conv.latestMessage && conv.latestMessage.id === messageId) {
            return { ...conv, latestMessage: null };
          }
          return conv;
        }));
        return; // done processing unsend
      }
      else if (!payload.action || payload.action === 'send') {
        // Otherwise it's a new message object coming from backend
        const newMessage = payload.message;
        if (!newMessage) return;

        // Always update the conversations list
        setConversations((prevConversations) => {
          const conversationIndex = prevConversations.findIndex(
            (c) => c.id === newMessage.conversationId
          );

          if (conversationIndex === -1) return prevConversations;

          const updatedConversation = {
            ...prevConversations[conversationIndex],
            latestMessage: newMessage,
          };
          const otherConversations = prevConversations.filter(
            (c) => c.id !== newMessage.conversationId
          );
          return [updatedConversation, ...otherConversations];
        });

        // If the message is for the currently selected conversation, update its message list
        if (selectedConversation && newMessage.conversationId === selectedConversation.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!input.trim() || !selectedConversation || !currentUserId) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'send',
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        content: {
          text: input
        }
      };

      // Clear input immediately for better UX
      setInput('');

      // Send the message via WebSocket
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('(handleSendMessage) WebSocket is not connected');
    }
  };

  const handleUnsendMessage = (messageId) => {
    if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
      console.error('(handleUnsendMessage) WebSocket is not connected');
      return;
    }

    const message = {
      action: 'unsend',
      messageId: messageId,
      currentUserId: currentUserId
    };

    ws.current.send(JSON.stringify(message));
  }

  // Effect for WebSocket setup and current user fetching
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:9999/backend/ws/message');
    ws.current.onopen = () => console.log('WebSocket connection opened');
    ws.current.onclose = () => console.log('WebSocket connection closed');
    ws.current.onerror = (error) => console.error('WebSocket error:', error);

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:9999/backend/api/current-user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Not logged in');
        setCurrentUserId(data.response.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) 
        ws.current.close();
    };
  }, []);

  // Effect for handling incoming WebSocket messages
  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = handleOnMessage;

    // cleanup
    return () => {
      if (ws.current) {
        ws.current.onmessage = null;
      }
    };
  }, [handleOnMessage]);

  // Effect for fetching messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }

      try {
        setMessagesLoading(true);
        setMessagesError(null);
        const response = await fetch(`http://localhost:9999/backend/api/messages?conversationId=${selectedConversation.id}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        await messagesResponseSchema.validate(data);
        setMessages(data.messages || []);
      } catch (err) {
        setMessagesError(err.message || 'Failed to load messages');
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  if (loading) {
      return (
          <LoadingScreen />
      );
  }

  // Check for any error that indicates user is not logged in
  if (error === 'Not logged in' || error === 'No user logged in') {
      console.log("(MessagesPage) Redirecting to login due to:", error);
      return <Navigate to="/login" replace />;
  }

  if (error) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Error</h2>
                  <p className="text-gray-600">{error}</p>
              </div>
          </div>
      );
  }

  if (!currentUserId) {
      console.log("(MessagesPage) No current user, redirecting to login");
      return <Navigate to="/login" replace />;
  }


  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50 p-4 gap-4">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-200 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationsList 
            conversations={conversations}
            loading={loadingConversations}
            error={conversationsError}
            selectedConversation={selectedConversation} 
            onSelectConversation={handleConversationSelect} 
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                  {selectedConversation.user?.avatarURL && (
                    <img 
                      src={selectedConversation.user.avatarURL} 
                      alt={selectedConversation.user.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="font-medium text-gray-900">{selectedConversation.user?.fullName || 'User'}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.user?.role || 'Artist'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-hidden">
              <MessagesList 
                conversationId={selectedConversation?.id} 
                currentUserId={currentUserId}
                messages={messages}
                loading={messagesLoading}
                error={messagesError}
                onUnsend={handleUnsendMessage}
              />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className={`ml-2 p-2 rounded-full ${input.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No conversation selected</h3>
              <p className="text-gray-500">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MessagesPage;