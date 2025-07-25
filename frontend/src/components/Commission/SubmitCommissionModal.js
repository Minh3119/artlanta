import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function SubmitCommissionModal({ open, onClose, onSubmit, loading }) {
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFileUrl('');
      setUploading(false);
    }
  }, [open]);

  const handleUrlChange = (e) => {
    setFileUrl(e.target.value);
  };

  const handleClear = () => {
    setFileUrl('');
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      toast.error('File URL is required');
      return;
    }
    setUploading(true);
    try {
      await onSubmit(fileUrl);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and transparency, not fully black */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/90 rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto animate-fadeIn z-10 border border-gray-200 backdrop-blur-md">
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
            text-gray-400 hover:text-gray-700 text-2xl 
            transition-colors duration-150 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onClose}>
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Submit Final Artwork</h2>
        <div className="mb-6">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700">File URL</label>
            <div className="relative">
              <input 
                type="url" 
                value={fileUrl}
                onChange={handleUrlChange}
                placeholder="Enter URL for your file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              {fileUrl && (
                <button 
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">Enter the URL for your file</span>
          </div>
        </div>
        <div className="flex gap-4 justify-end mt-6">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg 
                font-medium transition border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60" 
                onClick={onClose} disabled={uploading || loading}>
            Cancel
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg 
                font-semibold shadow-md transition border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60" 
                onClick={handleSubmit} disabled={uploading || loading || !fileUrl}>
            {uploading || loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitCommissionModal;