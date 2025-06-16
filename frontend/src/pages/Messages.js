import { useState, useEffect, useRef } from 'react';
import ConversationsList from '../components/Messages/ConversationsList';
import MessagesList from '../components/Messages/MessagesList';

const MessagesPage = () => {
  const ws = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null); // Will be set from your auth context or API

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

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

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
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    // TODO: Replace with actual current user ID from your auth context or API
    // This is just an example - get the current user ID from your auth system
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:9999/backend/api/current-user', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-screen font-sans bg-white">
      {/* Conversations List Column */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        </div>
        <ConversationsList 
          selectedConversation={selectedConversation}
          onSelectConversation={handleConversationSelect}
        />
      </div>

      {/* Messages Column */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <h2 className="text-lg font-semibold text-gray-800">{selectedConversation.user.fullName}</h2>
            </div>

            {/* Messages area */}
            <MessagesList 
              conversationId={selectedConversation?.id}
              currentUserId={currentUserId}
            />

            {/* Message input */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
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
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center bg-gray-50">
            <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
