import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const { id, createdAt, user, latestMessage } = conversation;
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-50 ${
        isSelected ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-gray-200 mr-4 overflow-hidden">
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
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate max-w-[150px]">
            {user.fullName}
          </h3>
          {latestMessage.createdAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
        {latestMessage && (
          <p className="text-sm text-gray-500 truncate max-w-[200px]">
            {latestMessage.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
