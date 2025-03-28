import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './PreviewButton.css';

const PreviewButton = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

  // Check preview mode status when the component mounts
  useEffect(() => {
    const previewMode = localStorage.getItem('previewMode') === 'true';
    setIsPreviewMode(previewMode);
  }, []);

  const handlePreviewClick = () => {
    if (isPreviewMode) {
      // Exit preview mode
      localStorage.removeItem('previewMode');
      setIsPreviewMode(false);
      navigate('/'); // Navigate to the main page (or another page) without reloading
    } else {
      // Enter preview mode
      localStorage.setItem('previewMode', 'true');
      setIsPreviewMode(true);
      navigate('/preview'); // Navigate to the preview page with the correct URL
    }
  };

  return (

        <button className='tag preview-button' onClick={handlePreviewClick}>
          {isPreviewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
        </button>

  );
};

export default PreviewButton;
