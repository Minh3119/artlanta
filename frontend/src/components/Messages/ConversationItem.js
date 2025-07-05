import { useState } from 'react';
import { Check, X, Archive } from 'lucide-react';

function getRelativeTime(timestamp) {
  const now = new Date();
  const target = new Date(timestamp);

  // Use UTC time for both
  const diffMs = target.getTime() - now.getTime(); // always in ms since epoch UTC

  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (Math.abs(diffSeconds) < 30) return "now";
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
}



// ChatConversationItem component for regular chat conversations
const ChatConversationItem = ({ conversation, onClick, onArchive, isSelected = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative px-4 py-2 cursor-pointer pr-12 group border-b border-gray-100 transition-colors ${
        isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={conversation.user?.avatarURL || '/default-avatar.png'}
            alt={conversation.user?.fullName || 'User'}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          {conversation.user?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-lg font-normal text-gray-900 truncate">
              {conversation.user?.fullName || 'Unknown User'}
            </h3>
            {conversation.latestMessage?.createdAt && (
              <span className="text-xs text-gray-500">
                {getRelativeTime(conversation.latestMessage.createdAt)}
              </span>
            )}
          </div>
          <p className="my-1 text-sm text-gray-600 truncate">
            {conversation.latestMessage?.content 
              ? (conversation.latestMessage.content.length > 50 
                  ? conversation.latestMessage.content.substring(0, 50) + '...' 
                  : conversation.latestMessage.content)
              : 'Start a new conversation'}
          </p>
        </div>
        {/* Archive button - appears on hover */}
        {onArchive && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(conversation.id);
            }}
            className="appearance-none bg-transparent border-none
                group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 text-xs font-medium"
            title="Archive conversation"
          >
            Archive
          </button>
        )}
      </div>
    </div>
  );
};

// PendingConversationItem component for pending message requests
const PendingConversationItem = ({ conversation, onAccept, onDecline }) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <img
          src={conversation.user.avatarURL}
          alt={conversation.user.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-lg font-normal text-gray-900 truncate">
              {conversation.user.fullName}
            </h3>
            <span className="text-xs text-gray-500">
              {getRelativeTime(conversation.latestMessage.createdAt)}
            </span>
          </div>
          <p className="my-1 text-sm text-gray-600 truncate">
            {conversation.latestMessage.content || 'Sent an attachment'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {conversation.mutualFriends} mutual friends
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onAccept && onAccept(conversation.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={() => onDecline && onDecline(conversation.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          <X className="w-4 h-4" />
          Decline
        </button>
      </div>
    </div>
  );
};

// ArchivedConversationItem component for archived conversations
const ArchivedConversationItem = ({ conversation, onClick, onUnarchive }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={() => onClick && onClick(conversation.id)}
      className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={conversation.user.avatarURL}
            alt={conversation.user.fullName}
            className="w-12 h-12 rounded-full object-cover opacity-75"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-lg font-normal text-gray-900 truncate">
              {conversation.user.fullName}
            </h3>
            <span className="text-xs text-gray-500">
              {getRelativeTime(conversation.latestMessage.createdAt)}
            </span>
          </div>
          <p className="my-1 text-sm text-gray-600 truncate">
            {conversation.latestMessage.content || 'Sent an attachment'}
          </p>
        </div>
        {/* Restore button - appears on hover */}
        {onUnarchive && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnarchive(conversation.id);
            }}
            className="appearance-none bg-transparent border-none
                group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
};


const ConversationItem = ({ conversation, type, onAccept, onDecline, onClick, onArchive, onUnarchive, isSelected }) => {
  switch (type) {
    case 'chat':
      return <ChatConversationItem 
        conversation={conversation} 
        onClick={onClick} 
        onArchive={onArchive} 
        isSelected={isSelected}
      />;
    case 'pending':
      return <PendingConversationItem conversation={conversation} onAccept={onAccept} onDecline={onDecline} />;
    case 'archived':
      return <ArchivedConversationItem conversation={conversation} onClick={onClick} onUnarchive={onUnarchive} />;
    default:
      return null;
  }
};

export default ConversationItem;
