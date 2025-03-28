// src/contentful/Preview.js
import React, { useState, useEffect } from 'react';

const Preview = () => {
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Check if preview mode is enabled in cookies or local storage (example logic)
    const previewStatus = localStorage.getItem('previewMode') === 'true';
    setPreviewMode(previewStatus);
  }, []);

  const handlePreviewToggle = () => {
    // Toggle preview mode and store in localStorage or cookies
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    localStorage.setItem('previewMode', newPreviewMode.toString());
  };

  return (
    <div>
      <button onClick={handlePreviewToggle}>
        {previewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
      </button>
      <p>Preview Mode is {previewMode ? 'ON' : 'OFF'}</p>
    </div>
  );
};

export default Preview;
