import React from 'react';
import './IntensityDropDown.css'

const IntensityDropDown = ({ label, options, selected, onChange }) => {
  return (
    <div className="dropdown-container">
      <label>{label}:</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default IntensityDropDown;
