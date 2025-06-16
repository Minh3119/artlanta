import { useState, useEffect, useRef } from 'react';
import ConversationsList from '../components/Messages/ConversationsList';

const MessagesPage = () => {
  const ws = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // WebSocket connection - will be implemented in the next phase
    ws.current = new WebSocket('ws://localhost:9999/backend/ws/message');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
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
    if (!input.trim() || !selectedConversation) return;
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        content: input,
        conversationId: selectedConversation.id,
        recipientId: selectedConversation.user.id,
        timestamp: new Date().toISOString(),
        senderId: 'current-user-id' // This should be replaced with the actual current user ID
      };
      
      // Add the message to local state immediately for a responsive UI
      setMessages(prev => [...prev, message]);
      setInput('');
      
      // Send the message via WebSocket
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    // Clear messages when switching conversations
    setMessages([]);
    // Here you would typically fetch messages for the selected conversation
    // We'll implement this in the next phase
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
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col ${
                        message.senderId === 'current-user-id' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-xl shadow ${
                          message.senderId === 'current-user-id'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p 
                          className={`text-xs mt-1 text-right ${
                            message.senderId === 'current-user-id' 
                              ? 'text-blue-100' 
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
