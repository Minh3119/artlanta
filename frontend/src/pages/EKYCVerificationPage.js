import React, { useEffect, useState } from 'react';
import { Upload, Camera, CheckCircle, XCircle, AlertCircle, Loader2, CreditCard, BookOpen } from 'lucide-react';
import { useNavigate, Link} from "react-router-dom";
import "../styles/eKyc.css";

const EKYCVerificationPage = () => {
  const [documentType, setDocumentType] = useState('cccd'); 
  const [documentImage, setDocumentImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect((
    () => {
      const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:9999/backend/api/session/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!data.loggedIn) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkLogin();
    }
  ),[]) 

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
      if (type === 'document') {
        setDocumentImage(file);
        setDocumentPreview(e.target.result);
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

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    setDocumentImage(null);
    setDocumentPreview(null);
    setErrors(prev => ({ ...prev, document: null }));
  };

  const handleSubmit = async () => {
    if (!documentImage || !faceImage) {
      setErrors({ general: `Thiếu ảnh ${documentType === 'cccd' ? 'CCCD' : 'Passport'} hoặc ảnh chân dung.` });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErrors({});

    const formData = new FormData();
    formData.append('document', documentImage);
    formData.append('face', faceImage);
    formData.append('documentType', documentType);

    try {
      const response = await fetch('http://localhost:9999/backend/api/verify-identity', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message,
          status: response.status
        });
      } else {
        let errorMessage = data.message || 'Có lỗi xảy ra trong quá trình xác thực';
        
        switch (response.status) {
          case 400:
            errorMessage = data.message;
            break;
          case 413:
            errorMessage = data.message;
            break;
          case 422:
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
    setDocumentImage(null);
    setFaceImage(null);
    setDocumentPreview(null);
    setFacePreview(null);
    setResult(null);
    setErrors({});
  };

  const FileUploadArea = ({ type, preview, onFileSelect, error, title, icon: Icon }) => (
    <div className="upload-area">
      <div className="upload-label">
        <Icon size={20} />
        <span>{title}</span>
      </div>
      
      <div
        className={`upload-zone ${error ? 'error' : ''} ${preview ? 'success' : ''}`}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(`file-input-${type}`).click()}
      >
        {preview ? (
          <div className="preview-container">
            <img 
              src={preview} 
              alt={`Preview ${type}`} 
              className="preview-image"
            />
            <p className="preview-success">✓ Đã chọn file</p>
            <p className="preview-filename">
              {type === 'document' ? documentImage?.name : faceImage?.name}
            </p>
          </div>
        ) : (
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <div>
              <p className="upload-text">Kéo thả file vào đây hoặc click để chọn</p>
              <p className="upload-hint">Định dạng: JPEG, PNG • Tối đa: 5MB</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <input
        id={`file-input-${type}`}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0], type)}
        className="file-input"
      />
    </div>
  );

  return (
    <div className="ekyc-container">
      <div className="ekyc-wrapper">
        <div className="ekyc-header">
          <h1 className="ekyc-title">Xác thực eKYC</h1>
          <p className="ekyc-subtitle">Tải lên ảnh giấy tờ tùy thân và ảnh chân dung để xác thực danh tính</p>
        </div>

        <div className="ekyc-card">
          <div className="document-type-section">
            <div className="div-flex">
              <h3 className="section-title">Chọn loại giấy tờ tùy thân</h3>
              <Link to="/" className="forgot-pass-link">
                        Back
              </Link>
            </div>
            <div className="document-type-buttons">
              <button
                onClick={() => handleDocumentTypeChange('cccd')}
                className={`document-type-btn ${documentType === 'cccd' ? 'active' : ''}`}
              >
                <CreditCard size={24} />
                <div className="document-type-info">
                  <div className="document-type-name">CCCD/CMND</div>
                  <div className="document-type-desc">Căn cước công dân</div>
                </div>
              </button>

              <button
                onClick={() => handleDocumentTypeChange('passport')}
                className={`document-type-btn ${documentType === 'passport' ? 'active' : ''}`}
              >
                <BookOpen size={24} />
                <div className="document-type-info">
                  <div className="document-type-name">Passport</div>
                  <div className="document-type-desc">Hộ chiếu</div>
                </div>
              </button>
            </div>
          </div>

          <div className="upload-grid">
            <FileUploadArea
              type="document"
              preview={documentPreview}
              onFileSelect={handleFileSelect}
              error={errors.document}
              title={`Ảnh ${documentType === 'cccd' ? 'CCCD/CMND' : 'Passport'}`}
              icon={documentType === 'cccd' ? CreditCard : BookOpen}
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

          {errors.general && (
            <div className="general-error">
              <AlertCircle size={20} />
              <span>{errors.general}</span>
            </div>
          )}

          {result && (
            <div className={`result-container ${result.success ? 'result-success' : 'result-error'}`}>
              {result.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
              <div className="result-content">
                <p className="result-message">{result.message}</p>
                {result.status && (
                  <p className="result-status">
                    Status: {result.status} • {new Date().toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !documentImage || !faceImage}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="spinner" />
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
              className="btn btn-secondary"
            >
              Làm mới
            </button>
          </div>

          <div className="instructions">
            <h3 className="instructions-title">Hướng dẫn chụp ảnh:</h3>
            <ul className="instructions-list">
              <li>• <strong>Ảnh {documentType === 'cccd' ? 'CCCD/CMND' : 'Passport'}:</strong> Chụp rõ nét, đầy đủ 4 góc, không bị che khuất hoặc phản quang</li>
              <li>• <strong>Ảnh chân dung:</strong> Nhìn thẳng vào camera, đủ ánh sáng, không đeo khẩu trang</li>
              <li>• <strong>Chất lượng:</strong> Cả hai ảnh phải có độ phân giải cao và không bị mờ</li>
              <li>• <strong>Định dạng:</strong> Chỉ chấp nhận file JPEG/PNG, tối đa 5MB mỗi file</li>
              {documentType === 'passport' && (
                <li>• <strong>Passport:</strong> Chụp trang có thông tin cá nhân và ảnh chân dung</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EKYCVerificationPage;