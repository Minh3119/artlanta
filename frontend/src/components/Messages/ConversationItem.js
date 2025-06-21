import React from 'react';
import { format } from 'date-fns';

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const { id, createdAt, user, latestMessage } = conversation;
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
        isSelected 
          ? 'bg-blue-50 border-l-4 border-blue-500' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={user.avatarURL} 
            alt={user.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        {!latestMessage?.isRead && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`text-sm font-medium truncate max-w-[150px] ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {user.fullName}
          </h3>
          {latestMessage?.createdAt && (
            <span className={`text-xs whitespace-nowrap ml-2 ${
              isSelected ? 'text-blue-500' : 'text-gray-400'
            }`}>
              {format(new Date(latestMessage.createdAt), 'HH:mm')}
            </span>
          )}
        </div>
        
        {latestMessage && (
          <div className="flex items-center mt-1">
            <p className={`text-sm truncate max-w-[200px] ${
              isSelected 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}>
              {latestMessage.content || 'Sent an attachment'}
            </p>
            {!latestMessage.isRead && !isSelected && (
              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
