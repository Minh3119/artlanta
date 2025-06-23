import { useState, useEffect, useRef } from 'react';
import { Trash2, Flag } from 'lucide-react';

const MessageActions = ({ onUnsend, onReport, messageId, isCurrentUser }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);


  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'unsend') {
      onUnsend?.(messageId);
    }
    if (action === 'report') {
      onReport?.(messageId)
    };
    setShowActions(false);
  };

  return (
    <div className="relative">
      {(onUnsend || onReport) && (<button 
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
        className="appearance-none bg-transparent border-none w-6 h-6 flex flex-col items-center justify-center space-y-0.5 group"
        aria-label="Message actions"
      >
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
        <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors"></span>
      </button>)}

      {showActions && (
        <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isCurrentUser ? 'right-0' : 'left-0'}`}>
          <div className="py-1" role="menu" aria-orientation="vertical" ref={actionsRef}>
            {onUnsend && (
              <button
                onClick={(e) => handleActionClick(e, 'unsend')}
                className="appearance-none bg-transparent border-none w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                role="menuitem"
              >
              <Trash2 className="w-4 h-4" />
              Unsend
            </button>
            )}
            {onReport && (
            <button
              onClick={(e) => handleActionClick(e, 'report')}
              className="appearance-none bg-transparent border-none w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              role="menuitem"
            >
              <Flag className="w-4 h-4" />
              Report
            </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageActions;
