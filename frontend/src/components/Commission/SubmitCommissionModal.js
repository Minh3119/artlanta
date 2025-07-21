import React, { useState, useEffect } from 'react';

function SubmitCommissionModal({ open, onClose, onSubmit, loading }) {
  const [finalFile, setFinalFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [finalPreview, setFinalPreview] = useState(null);
  const [previewPreview, setPreviewPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFinalFile(null);
      setPreviewFile(null);
      setFinalPreview(null);
      setPreviewPreview(null);
      setUploading(false);
    }
  }, [open]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'final') {
      setFinalFile(file);
      setFinalPreview(URL.createObjectURL(file));
    } else {
      setPreviewFile(file);
      setPreviewPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = (type) => {
    if (type === 'final') {
      setFinalFile(null);
      if (finalPreview) URL.revokeObjectURL(finalPreview);
      setFinalPreview(null);
    } else {
      setPreviewFile(null);
      if (previewPreview) URL.revokeObjectURL(previewPreview);
      setPreviewPreview(null);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!finalFile || !previewFile) {
      alert('Both images are required');
      return;
    }
    setUploading(true);
    try {
      await onSubmit(finalFile, previewFile);
    } catch (err) {
      alert(err.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Final Image Upload */}
          <div className="flex flex-col items-center">
            <label className="font-medium mb-2 text-gray-700">Final Image</label>
            {finalPreview ? (
              <div className="relative group mb-2">
                <img src={finalPreview} alt="Final Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                <button className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-500 hover:text-red-600 border border-gray-200 shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => handleRemove('final')}>
                  &times;
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition mb-2 bg-gray-50 hover:bg-blue-50">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'final')} />
                <span className="text-gray-400">Upload</span>
              </label>
            )}
            <span className="text-xs text-gray-500 text-center">High quality, no watermark</span>
          </div>
          {/* Preview Image Upload */}
          <div className="flex flex-col items-center">
            <label className="font-medium mb-2 text-gray-700">Preview (Watermarked)</label>
            {previewPreview ? (
              <div className="relative group mb-2">
                <img src={previewPreview} alt="Preview Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                <button className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-500 hover:text-red-600 border border-gray-200 shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => handleRemove('preview')}>
                  &times;
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition mb-2 bg-gray-50 hover:bg-blue-50">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'preview')} />
                <span className="text-gray-400">Upload</span>
              </label>
            )}
            <span className="text-xs text-gray-500 text-center">For client preview, must have watermark</span>
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
                onClick={handleUploadAndSubmit} disabled={uploading || loading || !finalFile || !previewFile}>
            {uploading || loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitCommissionModal; 