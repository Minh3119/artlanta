import React, { useState } from 'react';
import MessageActions from './MessageActions';
import MessageMedia from './MessageMedia';

function formatFullDateTime(timestamp) {
  const date = new Date(timestamp);

  const options = {
    weekday: 'short',     // "Mon"
    year: 'numeric',      // "2025"
    month: 'short',       // "Jan"
    day: 'numeric',       // "17"
    hour: '2-digit',      // "14"
    minute: '2-digit',    // "45"
    hour12: false         // 24-hour format
  };

  return date.toLocaleString(undefined, options);
}


// Current user message (sent messages - right side)
const CurrentUserMessage = ({ message, onUnsend, onReport }) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedTime = formatFullDateTime(message.createdAt);

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
            onUnsend={message.isDeleted?null:onUnsend} 
            onReport={onReport} 
            messageId={message.id} 
            isCurrentUser={true}
          />
        </div>

        <div className="relative">
          {/* Message bubble */}
          <div className="bg-blue-500 text-white px-3 py-2 rounded-3xl max-w-full break-words break-all">
            {/* Message content */}
            {message.content && !message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words whitespace-pre-line">
                {message.content}
              </p>
            )}
            {message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words whitespace-pre-line">
                This message has been deleted
              </p>
            )}
            {/* Message media */}
            {!message.isDeleted && (
              <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={true} />
            )}
          </div>

          {/* Timestamp - shows on hover */}
          <div className={`z-10 absolute -bottom-5 right-2 transition-opacity duration-200 ${
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
const OtherUserMessage = ({ message, onReport }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedTime = formatFullDateTime(message.createdAt);

  return (
    <div 
      className="flex justify-start mb-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end space-x-2 max-w-[70%]">
        <div className="relative">
          {/* Message bubble */}
          <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-3xl max-w-full break-words break-all">
            {/* Message content */}
            {message.content && !message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words whitespace-pre-line">
                {message.content}
              </p>
            )}
            {/* Message is deleted */}
            {message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words whitespace-pre-line">
                This message has been deleted
              </p>
            )}
            {/* Message media */}
            {!message.isDeleted && (
              <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={false} />
            )}
          </div>

          {/* Timestamp - shows on hover */}
          <div className={`z-10 absolute -bottom-5 left-2 transition-opacity duration-200 ${
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
            onUnsend={null}     // null so that it doesn't show the unsend option 
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
  return <OtherUserMessage message={message} onReport={onReport} />;
};

export default Message;