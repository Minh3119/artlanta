import React, { useState, useRef, useEffect } from 'react';

/**
 * MessageInput component renders an input field and send button for composing messages.
 *
 * Props:
 * - onSend: (text: string, attachedFile: File|null) => void – called when user triggers sending (button click or Enter key)
 */
const MessageInput = ({ onSend, isSending }) => {
  const textareaRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Automatically adjust textarea height to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAttachedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSend = () => {
    if (isSending) return; // prevent while uploading
    if (!inputText.trim() && !attachedFile) return;
    onSend(inputText, attachedFile);
    setInputText('');
    handleRemoveFile();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    // Send on Enter without modifiers
    if (isSending) return; // ignore key while uploading
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
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
  }, [inputText]);

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  return (
    <div className="w-full mx-auto p-4">
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
          onClick={handleSend}
          disabled={isSending}
          className={`appearance-none bg-transparent border-none underline transition-colors ${isSending ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {isSending ? 'sending...' : 'send'}
        </button>
      </div>

      {/* File preview container */}
      {attachedFile && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 border-l border-r border-gray-200 w-11/12 mx-auto">
          <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-700 text-sm flex-1 truncate">
            {attachedFile.name}
          </span>
          <button
            onClick={handleRemoveFile}
            className="appearance-none bg-transparent border-none text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}
      
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
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-t-0"
      />
    </div>
  );
};

export default MessageInput;
