import React, { useState } from 'react';
import { format } from 'date-fns';
import MessageActions from './MessageActions';
import MessageMedia from './MessageMedia';

// Current user message (sent messages - right side)
const CurrentUserMessage = ({ message, onUnsend, onReport }) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedTime = format(new Date(message.createdAt), 'HH:mm');

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
          <div className="bg-blue-500 text-white px-3 py-2 rounded-3xl max-w-full break-words break-all">
            {/* Message content */}
            {message.content && !message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            {message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words">
                This message has been deleted
              </p>
            )}
            {/* Message media */}
            {!message.isDeleted && (
              <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={true} />
            )}
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
          <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-3xl max-w-full break-words break-all">
            {/* Message content */}
            {message.content && !message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            {/* Message is deleted */}
            {message.isDeleted && (
              <p className="m-0 text-sm leading-relaxed break-words">
                This message has been deleted
              </p>
            )}
            {/* Message media */}
            {!message.isDeleted && (
              <MessageMedia mediaUrl={message.mediaUrl} isCurrentUser={false} />
            )}
          </div>

          {/* Timestamp - shows on hover */}
          <div className={`z-10 absolute -bottom-5 left-0 transition-opacity duration-200 ${
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