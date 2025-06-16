import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import ConversationsList from '../components/Messages/ConversationsList';
import MessagesList from '../components/Messages/MessagesList';
import LoadingScreen from '../components/common/LoadingScreen';

const MessagesPage = () => {
  const ws = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // WebSocket connection for real-time messaging
    ws.current = new WebSocket('ws://localhost:9999/backend/ws/message');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // Note: We're not handling incoming messages here anymore
    // as the MessagesList component will handle its own data fetching
    // and we don't have access to setMessages in this component anymore
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('New message received:', message);
        // The MessagesList component will handle displaying new messages
        // via its own data fetching when the conversation changes
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };


    /* Fetch current user */
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:9999/backend/api/current-user', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("(fetchCurrentUser) Response not ok:", response.status, data.error);
                throw new Error(data.error || 'Not logged in');
            }

            setCurrentUserId(data.response.id);
        } catch (err) {
            console.log("(fetchCurrentUser) Error caught:", err.message);
            setError(err.message);
        }
        finally {
          setLoading(false)
        }
    };

    fetchCurrentUser();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

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

  const handleSendMessage = () => {
    if (!input.trim() || !selectedConversation || !currentUserId) return;
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        content: input,
        conversationId: selectedConversation.id,
        recipientId: selectedConversation.user.id,
        timestamp: new Date().toISOString(),
        senderId: currentUserId,
        // The server should add these fields when broadcasting the message
        id: Date.now(), // Temporary ID, will be replaced by server
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      // Clear input immediately for better UX
      setInput('');
      
      // Send the message via WebSocket
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('(handleSendMessage) WebSocket is not connected');
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-white rounded-lg m-4 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
        </div>
        <ConversationsList 
          selectedConversation={selectedConversation} 
          onSelectConversation={handleConversationSelect} 
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg m-4 shadow-sm border border-gray-200 overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
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
              />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
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
