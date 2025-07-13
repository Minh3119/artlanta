import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const EKYCVerificationPage = () => {
  const [cccdImage, setCccdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [cccdPreview, setCccdPreview] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5242880;

    if (!validTypes.includes(file.type)) {
      return 'File phải là ảnh định dạng JPEG hoặc PNG.';
    }
    
    if (file.size > maxSize) {
      return 'Mỗi ảnh không được vượt quá 5MB.';
    }

    if (file.size === 0) {
      return 'File ảnh không được để trống.';
    }
    
    return null;
  };

  const handleFileSelect = (file, type) => {
    const error = validateFile(file);
    
    if (error) {
      setErrors(prev => ({ ...prev, [type]: error }));
      return;
    }

    setErrors(prev => ({ ...prev, [type]: null }));

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'cccd') {
        setCccdImage(file);
        setCccdPreview(e.target.result);
      } else {
        setFaceImage(file);
        setFacePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file, type);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!cccdImage || !faceImage) {
      setErrors({ general: 'Thiếu ảnh CCCD hoặc ảnh chân dung.' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErrors({});

    const formData = new FormData();
    formData.append('cccd', cccdImage);
    formData.append('face', faceImage);

    try {
      const response = await fetch('http://localhost:9999/backend/api/verify-identity', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message,
          status: response.status
        });
      } else {
        // Handle different error status codes from backend
        let errorMessage = data.message || 'Có lỗi xảy ra trong quá trình xác thực';
        
        switch (response.status) {
          case 400:
            // "Thiếu ảnh CCCD hoặc ảnh chân dung." or "File ảnh không được để trống." or "File phải là ảnh định dạng JPEG hoặc PNG."
            errorMessage = data.message;
            break;
          case 413:
            // "Mỗi ảnh không được vượt quá 5MB."
            errorMessage = data.message;
            break;
          case 422:
            // "Ảnh CCCD không hợp lệ hoặc không đọc được số ID." or "Khuôn mặt không khớp với ảnh trên CCCD."
            errorMessage = data.message;
            break;
          default:
            errorMessage = data.message || 'Có lỗi xảy ra trong quá trình xác thực';
        }

        setResult({
          success: false,
          message: errorMessage,
          status: response.status
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setResult({
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
        status: 'network_error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCccdImage(null);
    setFaceImage(null);
    setCccdPreview(null);
    setFacePreview(null);
    setResult(null);
    setErrors({});
  };

  const FileUploadArea = ({ type, preview, onFileSelect, error, title, icon: Icon }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <Icon size={20} />
        <span>{title}</span>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
          ${preview ? 'border-green-300 bg-green-50' : ''}`}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(`file-input-${type}`).click()}
      >
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt={`Preview ${type}`} className="max-h-40 mx-auto rounded-lg shadow-md object-contain" />
            <p className="text-green-600 font-medium">✓ Đã chọn file</p>
            <p className="text-sm text-gray-500">{type === 'cccd' ? cccdImage?.name : faceImage?.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload size={48} className="mx-auto text-gray-400" />
            <div>
              <p className="text-gray-600">Kéo thả file vào đây hoặc click để chọn</p>
              <p className="text-sm text-gray-500 mt-1">Định dạng: JPEG, PNG • Tối đa: 5MB</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <input
        id={`file-input-${type}`}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0], type)}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Xác thực eKYC</h1>
          <p className="text-gray-600">Tải lên ảnh CCCD và ảnh chân dung để xác thực danh tính</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* File Upload Areas */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <FileUploadArea
              type="cccd"
              preview={cccdPreview}
              onFileSelect={handleFileSelect}
              error={errors.cccd}
              title="Ảnh CCCD/CMND"
              icon={Camera}
            />
            
            <FileUploadArea
              type="face"
              preview={facePreview}
              onFileSelect={handleFileSelect}
              error={errors.face}
              title="Ảnh chân dung"
              icon={Camera}
            />
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {result.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
              <div className="flex-1">
                <p className="font-medium">{result.message}</p>
                {result.status && (
                  <p className="text-sm opacity-75 mt-1">
                    Status: {result.status} • {new Date().toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !cccdImage || !faceImage}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg 
                       hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Xác thực danh tính</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg 
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Làm mới
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn chụp ảnh:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Ảnh CCCD:</strong> Chụp rõ nét, đầy đủ 4 góc, không bị che khuất hoặc phản quang</li>
              <li>• <strong>Ảnh chân dung:</strong> Nhìn thẳng vào camera, đủ ánh sáng, không đeo khẩu trang</li>
              <li>• <strong>Chất lượng:</strong> Cả hai ảnh phải có độ phân giải cao và không bị mờ</li>
              <li>• <strong>Định dạng:</strong> Chỉ chấp nhận file JPEG/PNG, tối đa 5MB mỗi file</li>
            </ul>
          </div>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Debug:</strong> CCCD file: {cccdImage?.name || 'None'} | Face file: {faceImage?.name || 'None'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EKYCVerificationPage;