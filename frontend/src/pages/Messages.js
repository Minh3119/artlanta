import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ConversationsList from '../components/Messages/ConversationsList';
import MessagesList from '../components/Messages/MessagesList';
import LoadingScreen from '../components/common/LoadingScreen';
import MessageInput from '../components/Messages/MessageInput';
import { messagesResponseSchema } from '../schemas/messaging';
import imageCompression from 'browser-image-compression';
import SearchBar from '../components/Messages/SearchBar';
import ConversationTypeSelector from '../components/Messages/ConversationTypeSelector';
import Header from '../components/HomePage/Header';
import { useWebSocket } from '../contexts/WebSocketContext';

// Utility function to sort conversations by latest message timestamp (newest first)
const sortConversationsByLatestMessage = (conversations) => {
  return [...conversations].sort((a, b) => {
    // Handle cases where latestMessage might be null/undefined
    const msgA = a.latestMessage;
    const msgB = b.latestMessage;
    
    // If both have no messages or timestamps, keep their order
    if ((!msgA || !msgA.createdAt) && (!msgB || !msgB.createdAt)) return 0;
    
    // If only A has no timestamp, put it after B
    if (!msgA || !msgA.createdAt) return 1;
    
    // If only B has no timestamp, put it after A
    if (!msgB || !msgB.createdAt) return -1;
    
    // Compare timestamps using Date objects
    const dateA = new Date(msgA.createdAt).getTime();
    const dateB = new Date(msgB.createdAt).getTime();
    
    // For descending order (newest first)
    return dateB - dateA;
  });
};

const MessagesPage = () => {
  const { currentUserId, sendMessage, registerMessageHandler } = useWebSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [conversations, setConversations] = useState({
    chat: [],
    pending: [],
    archived: []
  });
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleConversationSelect = useCallback((conversation) => {
    // Update the URL with the new conversation ID
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('conversationId', conversation.id);
    setSearchParams(newSearchParams);
    setSelectedConversation(conversation);
  }, [setSearchParams]);

  const fetchConversations = async (type) => {
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

      // Sort conversations by latest message (newest first)
      const sortedData = sortConversationsByLatestMessage(data.conversations || []);
      
      // Update conversations.[type] = sortedData
      setConversations(prev => ({
        ...prev,
        [type]: sortedData
      }));
    } catch (err) {
      setConversationsError(err.message);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Effect for fetching conversations
  useEffect(() => {
    const loadAllConversations = async () => {
      await Promise.all([
        fetchConversations('chat'),
        fetchConversations('pending'),
        fetchConversations('archived')
      ]);
    };
    
    loadAllConversations();
  }, []);

  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch conversations when component mounts or active tab changes
  useEffect(() => {
    fetchConversations(activeTab);
  }, [activeTab]);

  const getCurrentConversations = () => {
    return conversations[activeTab] || [];
  };

  const getConversationCount = (type) => {
    return conversations[type]?.length || 0;
  };

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

  // After conversations load, try to select based on query param, else first
  useEffect(() => {
    if (conversations[activeTab].length === 0) return;
    const conversationIdParam = searchParams.get('conversationId');
    if (conversationIdParam) {
      const found = conversations[activeTab].find(c => c.id === parseInt(conversationIdParam));
      if (found) {
        setSelectedConversation(found);
        return;
      }
    }
    // default if not selected
    if (!selectedConversation) {
      setSelectedConversation(conversations[activeTab][0]);
    }
  }, [conversations, selectedConversation, searchParams, activeTab]);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOnMessage = useCallback((payload) => {
    // Handle unsend action broadcast
    if (payload.action === 'unsend') {
      const { messageId } = payload;

      // Instead of removing, mark the message as deleted and replace its content
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            content: 'This message has been deleted',
            isDeleted: true,
          };
        }
        return m;
      }));

      // Update conversations list (if latestMessage is the one unsent, update its content)
      setConversations(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(conv => {
          if (conv.latestMessage && conv.latestMessage.id === messageId) {
            return {
              ...conv,
              latestMessage: {
                ...conv.latestMessage,
                content: 'This message has been deleted',
              }
            };
          }
          return conv;
        })
      }));
      return; // done processing unsend
    }
    else if (!payload.action || payload.action === 'send') {
      // Otherwise it's a new message object coming from backend
      const newMessage = payload.message;
      if (!newMessage) return;

      // Update conversations list with the new message and re-sort
      setConversations(prev => ({
        ...prev,
        [activeTab]: sortConversationsByLatestMessage(
          prev[activeTab].map(conv => {
            if (conv.id === newMessage.conversationId) {
              return {
                ...conv,
                latestMessage: newMessage,
              };
            }
            return conv;
          })
        )
      }));

      // If the message is for the currently selected conversation, update its message list
      if (selectedConversation && newMessage.conversationId === selectedConversation.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  }, [selectedConversation, activeTab]);

  // Register message handler with WebSocket context
  useEffect(() => {
    const cleanup = registerMessageHandler(handleOnMessage);
    return cleanup;
  }, [handleOnMessage, registerMessageHandler]);

  const handleSendMessage = async (messageText, attachedFile) => {
    if ((!messageText || !messageText.trim()) && !attachedFile) return;
    if (!selectedConversation || !currentUserId) return;

    let media = null;

    // 1. Compress & upload the attached file (if any)
    if (attachedFile) {
      try {
        setIsUploading(true);
        let fileToUpload = attachedFile;
        // Compress only if it is an image
        if (attachedFile.type && attachedFile.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          };
          try {
            fileToUpload = await imageCompression(attachedFile, options);
          } catch (compressErr) {
            console.error('Image compression failed, using original file', compressErr);
          }
        }

        const formData = new FormData();
        formData.append('file[]', fileToUpload);

        const uploadRes = await fetch('http://localhost:9999/backend/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && !uploadData.error && uploadData.response && uploadData.response.length > 0) {
          const url = uploadData.response[0].url;
          media = {
            type: attachedFile.type && attachedFile.type.startsWith('image/') ? 'image' : 'file',
            url,
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

    // 2. Build and send WebSocket payload
    const messagePayload = {
      action: 'send',
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content: {
        text: messageText,
        media, // may be null
      },
    };
    sendMessage(messagePayload);
  };

  const handleUnsendMessage = (messageId) => {
    const message = {
      action: 'unsend',
      messageId: messageId,
      currentUserId: currentUserId
    };

    sendMessage(message);
  }

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

  // Check if user is logged in
  useEffect(() => {
    if (currentUserId) {
      setLoading(false);
    } else {
      setError('Not logged in');
      setLoading(false);
    }
  }, [currentUserId]);

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
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="pt-14 flex-1 overflow-hidden flex flex-col">
        <div className="pb-2 px-2 pt-4 flex-1 flex gap-4 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 h-full bg-white rounded-lg shadow-sm flex flex-col border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h1 className="mb-4 text-xl font-semibold text-gray-800">Messages</h1>
              {/* Search Bar Component */}
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search conversations..."
              />
              {/* Conversation Type Selector Component */}
              <ConversationTypeSelector
                activeType={activeTab}
                onTypeChange={setActiveTab}
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                getCount={getConversationCount}
              />
            </div>
            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <ConversationsList
                conversations={getCurrentConversations()}
                type={activeTab}
                loading={loadingConversations}
                error={conversationsError}
                selectedConversation={selectedConversation}
                onSelectConversation={handleConversationSelect}
                searchQuery={searchQuery}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
                onArchive={handleArchiveConversation}
                onUnarchive={handleUnarchiveConversation}
              />
            </div>
          </div>  {/* End of Sidebar */}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                      {selectedConversation.user?.avatarURL && (
                        <img 
                          src={selectedConversation.user.avatarURL} 
                          alt={selectedConversation.user.fullName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-900">{selectedConversation.user?.fullName || 'User'}</h2>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.user?.role || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-auto">
                  <MessagesList 
                    key={selectedConversation?.id}
                    conversationId={selectedConversation?.id} 
                    currentUserId={currentUserId}
                    messages={messages}
                    loading={messagesLoading}
                    error={messagesError}
                    onUnsend={handleUnsendMessage}
                    // onReport={handleReportMessage}
                  />
                </div>

                {/* Message Input */}
                <MessageInput onSend={handleSendMessage} isSending={isUploading} />
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
          </div>  {/* End of Main Chat Area */}
        </div>  {/* End of content container */}
      </div>  {/* End of main container */}
    </div>
  );
};

export default MessagesPage;