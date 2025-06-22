import React, { useState, useRef, useEffect } from 'react';

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
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Automatically adjust textarea height to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAttachedFile(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    // Send on Enter without modifiers
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Button container */}
      <div className="flex items-center justify-between h-10 px-3 rounded-t-lg border border-gray-200 w-11/12 mx-auto border-b-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAttachmentClick}
            className="appearance-none bg-transparent border-none text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            add attachment
          </button>
          {attachedFile && (
            <span className="text-gray-600 text-sm">
              {attachedFile.name}
            </span>
          )}
        </div>
        <button
          onClick={onSend}
          className="appearance-none bg-transparent border-none text-gray-500 hover:text-gray-700 underline transition-colors"
        >
          send
        </button>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Text area */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-t-0"
      />
    </div>
  );
};

export default MessageInput;
