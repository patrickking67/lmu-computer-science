import React, { useState } from "react";

const Settings = () => {
  const savedData = JSON.parse(localStorage.getItem("questionnaire")) || {};
  const [formData, setFormData] = useState(savedData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("questionnaire", JSON.stringify(formData));
    alert("Settings updated successfully!");
  };

  return (
    <div className="settings-container">
      <h2>Profile & Settings</h2>

      {Object.keys(formData).map((key) => (
        <div className="form-group" key={key}>
          <label>{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        </div>
      ))}

      <button onClick={handleSave} className="submit-btn">Save Changes</button>
    </div>
  );
};

export default Settings;
