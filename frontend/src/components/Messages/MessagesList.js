import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Message from './Message';

const MessagesList = ({ conversationId, currentUserId, messages, loading, error }) => {
  // We will scroll the container directly for more predictable behavior
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scrolls the container to the very bottom. Using scrollTo on the container is more reliable
  const scrollToBottom = (behavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const options = { top: container.scrollHeight };
    if (behavior === 'smooth') {
      options.behavior = 'smooth';
    }
    container.scrollTo(options);
  };

  // Check if user is near bottom (within 100px)
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 10;
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    setShouldAutoScroll(isNearBottom());
  };

  // Reset state when conversation changes
  useEffect(() => {
    if (conversationId) {
      setShouldAutoScroll(true);
      setIsInitialLoad(true);
    }
  }, [conversationId]);

  // Auto-scroll logic for messages. useLayoutEffect guarantees the scroll happens
  // right after DOM mutations but before the browser paints, eliminating flicker.
  useLayoutEffect(() => {
    if (messages.length === 0 || !messagesContainerRef.current) return;

    if (isInitialLoad) {
      // Jump to bottom instantly on first render of a conversation
      scrollToBottom('auto');
      setIsInitialLoad(false);
    } else if (shouldAutoScroll) {
      // Smooth scroll on new incoming messages when the user hasn't scrolled up
      scrollToBottom('smooth');
    }
  }, [messages, isInitialLoad, shouldAutoScroll]);

  // Keep observing for DOM size changes (e.g. when images finish loading)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom('auto');
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [shouldAutoScroll]);

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
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto"
        onScroll={handleScroll}
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
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Optional: Show scroll to bottom button when auto-scroll is disabled */}
      {!shouldAutoScroll && messages.length > 0 && (
        <div className="absolute bottom-20 right-6">
          <button
            onClick={() => scrollToBottom('smooth')}
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagesList;