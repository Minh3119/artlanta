import { useState } from "react";

const InputField = ({ type, placeholder, icon, value, onChange }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        className="input-field"
        required
        value={value}      
        onChange={onChange}   
      />
      <i className="material-symbols-outlined">{icon}</i>
    </div>
  );
};

export default InputField;