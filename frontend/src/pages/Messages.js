import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ConversationsList from '../components/Messages/ConversationsList';
import MessagesList from '../components/Messages/MessagesList';
import LoadingScreen from '../components/common/LoadingScreen';
import MessageInput from '../components/Messages/MessageInput';
import SearchBar from '../components/Messages/SearchBar';
import ConversationTypeSelector from '../components/Messages/ConversationTypeSelector';
import Header from '../components/HomePage/Header';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';

const MessagesPage = () => {
  const { currentUserId } = useWebSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasSelectedInitialConversation = useRef(false);
  const previousActiveTab = useRef(null);

  const {
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
  } = useConversations();

  const {
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
  } = useMessages(selectedConversation, activeTab, setConversations, sortConversationsByLatestMessage);

  const handleConversationSelect = useCallback((conversation) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('conversationId', conversation.id);
    setSearchParams(newSearchParams);
    setSelectedConversation(conversation);
    hasSelectedInitialConversation.current = true;
  }, [setSearchParams]);

  // After conversations load, try to select based on query param, else first
  useEffect(() => {
    const conversations = getCurrentConversations();
    if (conversations.length === 0) return;

    // Reset selection flag when activeTab changes
    if (previousActiveTab.current !== activeTab) {
      hasSelectedInitialConversation.current = false;
      previousActiveTab.current = activeTab;
    }

    // Only select initial conversation if we haven't already
    if (hasSelectedInitialConversation.current) return;

    const conversationIdParam = searchParams.get('conversationId');
    if (conversationIdParam) {
      const found = conversations.find(c => c.id === parseInt(conversationIdParam));
      if (found) {
        setSelectedConversation(found);
        hasSelectedInitialConversation.current = true;
        return;
      }
    }
    
    if (!selectedConversation && conversations.length > 0) {
      handleConversationSelect(conversations[0]);
    }
  }, [getCurrentConversations, searchParams, activeTab, selectedConversation]);

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
    return <LoadingScreen />;
  }

  if (error === 'Not logged in' || !currentUserId) {
    console.log("(MessagesPage) Redirecting to login due to:", error || "No current user");
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
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search conversations..."
              />
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
                    conversationId={selectedConversation?.id} 
                    currentUserId={currentUserId}
                    messages={messages}
                    loading={isMessagesLoading}
                    error={messagesError}
                    onUnsend={handleUnsendMessage}
                    handleScroll={handleScroll}
                    isLoadingOlder={isLoadingOlder}
                    loadOlderMessages={loadOlderMessages}
                    isInitialLoad={isInitialLoad}
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