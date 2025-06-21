import React, { useRef, useEffect } from 'react';

/**
 * MessageInput component renders an input field and send button for composing messages.
 *
 * Props:
 * - value: string – current message text
 * - onChange: (value: string) => void – called when the input changes
 * - onSend: () => void – called when user triggers sending (button click or Enter key)
 */
const MessageInput = ({ value, onChange, onSend }) => {
  const textareaRef = useRef(null);

  // Automatically adjust textarea height to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Send on Enter without modifiers
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSend();
    }
  };


  return (
    <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center">
        <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aa"
            className="w-full resize-none max-h-40 overflow-y-auto bg-gray-100 rounded-3xl py-2 px-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 rounded-full transition-colors ${
            value.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >

          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
