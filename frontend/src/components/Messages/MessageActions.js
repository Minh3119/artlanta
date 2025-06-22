import { useState } from 'react';

// // Utility function to call backend API for deleting a message
// async function deleteMessage(id) {
//   try {
//     const res = await fetch(`http://localhost:9999/backend/api/messages?id=${id}`, { 
//       method: 'DELETE',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const data = await res.json();
//     if (!res.ok || !data.success) {
//       throw new Error(data?.error || 'Failed to delete message');
//     }
//     return true;
//   } catch (err) {
//     console.error(err);
//     alert(err.message || 'Unable to unsend message');
//     return false;
//   }
// }

const MessageActions = ({ onUnsend, onReport, messageId, isCurrentUser }) => {
  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'unsend') {
      onUnsend?.(messageId);
      console.log(messageId);
    }
    if (action === 'report') {
      onReport?.(messageId)
    };
    setShowActions(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
        className="w-6 h-6 flex flex-col items-center justify-center space-y-0.5 group"
        aria-label="Message actions"
      >
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
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

export default MessageActions;
