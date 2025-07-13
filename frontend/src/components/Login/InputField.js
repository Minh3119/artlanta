import { useState } from "react";

const InputField = ({ type, placeholder, icon, value, onChange, id }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        className="input-field"
        id={id}
        required
        value={value}
        onChange={onChange}
      />
      <i className="material-symbols-outlined">{icon}</i>
    </div>
  );
};

export default InputField;