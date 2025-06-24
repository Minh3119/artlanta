import React, { useEffect, useRef } from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import Message from './Message';

function ScrollToBottomButton() {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  if (sticky) {
    return null;
  }

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
      <button
        onClick={scrollToBottom}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Scroll to bottom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

const MessagesList = React.memo(({ conversationId, currentUserId, messages, loading, error, onUnsend, onReport }) => {
  const scrollRef = useRef();

  // Force scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollRef.current.scrollToBottom();
      }, 100);
    }
  }, [messages.length]);

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No conversation selected</h3>
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-3 text-sm text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollToBottom 
        ref={scrollRef}
        className="flex-1 px-4 overflow-y-auto overflow-x-hidden relative"
        follow={true}
        mode="bottom"
        initialScrollBehavior="smooth"
        key={conversationId}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
            <p className="text-gray-500 max-w-md">
              Say hi and start the conversation! Your messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <Message 
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUserId}
                onUnsend={onUnsend}
                onReport={onReport}
              />
            ))}
          </div>
        )}
        <ScrollToBottomButton />
      </ScrollToBottom>
    </div>
  );
});

MessagesList.displayName = 'MessagesList';

export default MessagesList;