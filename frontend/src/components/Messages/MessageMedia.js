import { useState } from 'react';

const MessageMedia = ({ mediaUrl }) => {
  const [imageError, setImageError] = useState(false);

  if (!mediaUrl) return null;

  if (imageError) {
    return (
      <div className="mt-2 p-3 rounded-2xl border border-gray-200 bg-gray-50 max-w-[280px] text-center">
        <div className="text-gray-400 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Unable to load image</p>
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-2xl overflow-hidden max-w-[280px]">
      <img 
        src={mediaUrl} 
        alt="Message media" 
        className="w-full h-auto max-h-[280px] object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default MessageMedia;