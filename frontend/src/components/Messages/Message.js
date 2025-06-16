import React, { useState } from 'react';


const MessageActions = ({ onUnsend, onReport, messageId, isCurrentUser }) => {
  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'unsend') onUnsend?.(messageId);
    if (action === 'report') onReport?.(messageId);
    setShowActions(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>

      {showActions && (
        <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isCurrentUser ? 'right-0' : 'left-0'}`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={(e) => handleActionClick(e, 'unsend')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Unsend
            </button>
            <button
              onClick={(e) => handleActionClick(e, 'report')}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              role="menuitem"
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageMedia = ({ mediaUrl, isCurrentUser }) => {
  const [imageError, setImageError] = useState(false);

  if (!mediaUrl) return null;

  if (imageError) {
    return (
      <div className="mt-2 p-3 rounded-2xl border border-gray-200 bg-gray-50 max-w-[280px] text-center">
        <div className="text-gray-400 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Unable to load image</p>
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-2xl overflow-hidden max-w-[280px]">
      <img 
        src={mediaUrl} 
        alt="Message media" 
        className="w-full h-auto max-h-[280px] object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// Current user message (sent messages - right side)
const CurrentUserMessage = ({ message, onUnsend, onReport }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="flex justify-end mb-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end space-x-2 max-w-[70%]">
        {/* Actions button - shows on hover */}
        <div className={`flex items-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <MessageActions 
            onUnsend={onUnsend} 
            onReport={onReport} 
            messageId={message.id} 
            isCurrentUser={true}
          />
        </div>

        <div className="relative">
          {/* Message bubble */}
          <div className="bg-blue-500 text-white px-3 py-2 rounded-3xl max-w-full">
            {message.content && (
              <p className="m-0 text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={true} />
          </div>

          {/* Timestamp - shows on hover */}
          <div className={`z-10 absolute -bottom-5 right-0 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Other user message (received messages - left side)
const OtherUserMessage = ({ message, onUnsend, onReport }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="flex justify-start mb-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end space-x-2 max-w-[70%]">
        <div className="relative">
          {/* Message bubble */}
          <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-3xl rounded-bl-lg max-w-full">
            {message.content && (
              <p className="m-0 text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={false} />
          </div>

          {/* Timestamp - shows on hover */}
          <div className={`absolute -bottom-5 left-0 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Actions button - shows on hover */}
        <div className={`flex items-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <MessageActions 
            onUnsend={onUnsend} 
            onReport={onReport} 
            messageId={message.id} 
            isCurrentUser={false}
          />
        </div>
      </div>
    </div>
  );
};

// Main Message component that chooses which component to render
const Message = ({ message, isCurrentUser, onUnsend, onReport }) => {
  if (isCurrentUser) {
    return <CurrentUserMessage message={message} onUnsend={onUnsend} onReport={onReport} />;
  }
  return <OtherUserMessage message={message} onUnsend={onUnsend} onReport={onReport} />;
};

export default Message;