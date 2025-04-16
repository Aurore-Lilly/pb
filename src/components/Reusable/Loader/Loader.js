import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './Loader.css';

const Loader = ({ onAnimationComplete }) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    
    const timeline = gsap.timeline({
      delay: 0.5,
    });

    timeline
      .fromTo(
        '.progress-bar',
        { width: '0%' },
        { width: '100%', duration: 3, ease: 'power1.inOut' }
      )
      .to('.loader', {
        opacity: 0,
        filter: 'blur(2px)',
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          setShouldRender(false); // 👈 fade done, now remove from DOM
          if (onAnimationComplete) onAnimationComplete(); // tell parent it's safe
        },
      });
  }, [onAnimationComplete]);

  if (!shouldRender) return null;

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
