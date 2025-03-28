import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './Loader.css';

const Loader = ({ onLoadingComplete }) => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Handle the opacity animation for the loader container
    gsap.fromTo(
      '.loader',
      { opacity: 1 },
      { opacity: 0, duration: 1.5, delay: 4, onComplete: () => {
        setLoadingComplete(true); // Mark loading as complete
        if (onLoadingComplete) {
          onLoadingComplete(); // Ensure the callback is passed and is a function
        }
      }}
    );

    // Animate progress bar width (simulate loading progress)
    gsap.fromTo(
      '.progress-bar',
      { width: '0%' },
      { width: '100%', duration: 5, ease: 'power1.inOut' }
    );
  }, [onLoadingComplete]);

  // If loading is complete, render null
  if (loadingComplete) {
    return null; // Hide the loader once loading is complete
  }

  return (
    <div className="loader">
      <h5 className="loader-text cursive">
        <sup>Pauline</sup> Babin
      </h5>
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
