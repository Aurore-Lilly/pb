import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreviewButton.css';

const PreviewButton = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const navigate = useNavigate();

  // Read the environment variable to check if preview mode is enabled
  const isPreviewEnabled = process.env.REACT_APP_PREVIEW_MODE === 'true';

  useEffect(() => {
    const previewMode = localStorage.getItem('previewMode') === 'true';
    setIsPreviewMode(previewMode);
  }, []);

  const handlePreviewClick = () => {
    if (isPreviewMode) {
      localStorage.removeItem('previewMode');
      setIsPreviewMode(false);
      navigate('/');
    } else {
      localStorage.setItem('previewMode', 'true');
      setIsPreviewMode(true);
      navigate('/preview');
    }
  };

  // If preview mode is disabled via .env, don't show the button
  if (!isPreviewEnabled) return null;

  return (
    <button className='tag preview-button' onClick={handlePreviewClick}>
      {isPreviewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
    </button>
  );
};

export default PreviewButton;
