import React, { useState } from 'react';
import "../../styles/CommissionRequest.css";

export default function CommissionRequestForm({ onClose ,artistID, artistUsername, artistAvatarURL }) {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    deadline: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = () => {
  const { description, price, deadline } = formData;

  fetch(`http://localhost:9999/backend/api/reqcom?artistID=${artistID}&shortDescription=${encodeURIComponent(description)}&proposedPrice=${encodeURIComponent(price)}&proposedDeadline=${encodeURIComponent(deadline)}`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        alert(json.message);
      } else if (json.error) {
        alert("Lỗi: " + json.error);
      } else {
        alert("Lỗi không xác định.");
      }
    })
    .catch(() => {
      alert("Không thể kết nối đến máy chủ.");
    })
    .finally(() => {
      onClose();
      window.location.reload();
    });
};



  return (
    <div className="call-to-action-container">
      {/* Background Images 3-2-9-12-7-5-8-6-1-4-10-11 */}
      <img className="bg-image-1" src="https://i.ibb.co/tppjWybm/starry-wtf.png" alt="" />
      <img className="bg-gradient" src="https://i.ibb.co/twc5csPW/tt34t345r345.png" alt="" />
      
      {/* Floating Elements */}
      <img className="floating-element-1" src="https://i.ibb.co/0pfKQf10/82237481.png" alt="" />
      <img className="floating-element-2" src="https://i.ibb.co/MDLHHbP5/82237483.png" alt="" />
      <img className="floating-element-3" src="https://i.ibb.co/B2vck5vf/8223748.png" alt="" />
      <img className="floating-element-4" src="https://i.ibb.co/MDrx58zd/82237482.png" alt="" />
      <img className="floating-element-5" src="https://i.ibb.co/W4QQs3Gd/153-Z-2306-w006-n001-137-A-p25.png" alt="" />
      <img className="floating-element-6" src="https://i.ibb.co/8D8Rc7Xp/153-Z-2306-w006-n001-137-A-p25-1.png" alt="" />
      <img className="floating-element-7" src="https://i.ibb.co/HDhtgmpL/153-Z-2306-w006-n001-137-A-p25-2.png" alt="" />
      <img className="floating-element-8" src="https://i.ibb.co/TXK5Yqj/153-Z-2306-w006-n001-137-A-p25-3.png" alt="" />
      <img className="floating-element-9" src="https://i.ibb.co/HpnDL2Bf/153-Z-2306-w006-n001-137-A-p25-4.png" alt="" />
      <img className="floating-element-10" src="https://i.ibb.co/HpnDL2Bf/153-Z-2306-w006-n001-137-A-p25-4.png" alt="" />
      <img className="floating-element-11" src="https://i.ibb.co/ZpgDDw2p/153-Z-2306-w006-n001-137-A-p25-6.png" alt="" />
      <img className="floating-element-12" src="https://i.ibb.co/DD0SDMZ1/153-Z-2306-w006-n001-137-A-p25-1.png" alt="" />

      {/* Main Form Container */}
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Request Commission</h1>
        </div>

        <div className="artist-info">
          <img className="artist-avatar" src={artistAvatarURL} alt="Artist Avatar" />
          <div style={{display:'flex',flexDirection:'column',alignItems:'start',fontFamily:'sans-serif',gap:'4px'}}>
          <span className="artist-label" style={{display:'inline-block',background:'linear-gradient(to right,#D3FD8F 0%,#FAE1BB 50%,#FDC6C6 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Artist</span>
          <span className="artist-label" style={{fontSize:'18px',color:'rgba(255,255,255,0.6)'}}>@{artistUsername}</span></div>


        </div>

        <div className="commission-form">
          <div className="form-group">
            <label className="form-label">
              <svg className="label-icon" fill="#ffffff" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
  <path d="M17,11h1a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1v1A1,1,0,0,0,17,11ZM6,12h5a1,1,0,0,0,0-2H6a1,1,0,0,0,0,2ZM22,4H2A1,1,0,0,0,1,5V19a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V5A1,1,0,0,0,22,4ZM21,18H3V6H21ZM6,16h5a1,1,0,0,0,0-2H6a1,1,0,0,0,0,2Z"/>
</svg>
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe your commission request..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="#ffffff" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.46,6,11,5.41V9a1,1,0,0,0,2,0V5.41l.54.55A1,1,0,0,0,15,6a1,1,0,0,0,0-1.42L12.71,2.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21L9,4.54A1,1,0,0,0,10.46,6ZM12,12a3,3,0,1,0,3,3A3,3,0,0,0,12,12Zm0,4a1,1,0,1,1,1-1A1,1,0,0,1,12,16ZM5,15a1,1,0,1,0,1-1A1,1,0,0,0,5,15Zm14,0a1,1,0,1,0-1,1A1,1,0,0,0,19,15Zm1-7H16a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1v8a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H8A1,1,0,0,0,8,8H4a3,3,0,0,0-3,3v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V11A3,3,0,0,0,20,8Z"/>
</svg>

                Price - VND
              </label>
              <input
  type="number"
  name="price"
  value={formData.price}
  onChange={handleInputChange}
  className="form-input"
  placeholder="Enter price"
    className="form-select"
/>

            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="#ffffff" width="800px" height="800px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
  <path d="M12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20ZM14.09814,9.63379,13,10.26807V7a1,1,0,0,0-2,0v5a1.00025,1.00025,0,0,0,1.5.86621l2.59814-1.5a1.00016,1.00016,0,1,0-1-1.73242Z"/>
</svg>

                Deadline
              </label>
              <input
  type="date"
  name="deadline"
  value={formData.deadline}
  onChange={handleInputChange}
  className="form-select"
/>
            </div>
          </div>

          <div className="button-row">
            <button onClick={handleSubmit} className="primary-button">
              Sending
              <svg className="button-icon" viewBox="0 0 12 12">
                <path d="M5.88 1.88L10.12 6.12L5.88 10.36" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="secondary-button" onClick={onClose}>
        Close
      </button>
          </div>
        </div>
      </div>
    </div>
  );
}