import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import LandingPage from '../../LandingPage/LandingPage';
import Hamburger from '../../Reusable/Header/Hamburger';
import ImageHero from '../../Reusable/ImageHero';
import Loader from '../../Reusable/Loader/Loader';

const LazyWowText = React.lazy(() => import("../../LandingPage/Wow"));
const LazyService = React.lazy(() => import('../../LandingPage/Service/Service'));
const LazyGetInTouch = React.lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
const LazyFooter = React.lazy(() => import('../../Reusable/Footer/Footer'));
const LazyTestimonialSlider = React.lazy(() => import('../../Testimonials/Testimonials'));

const MainPage = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleLoadingComplete = () => {
    const loader = document.querySelector('.loader');

    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setShowLoader(false); // remove loader
          setHasLoaded(true);   // mount main content
          setTimeout(() => setContentReady(true), 50); // slight buffer before animating
        },
      });
    }
  };

  useEffect(() => {
    if (!contentReady || !mainRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setAnimationFinished(true),
      });

      tl.from('.toggle-button', {
        opacity: 1,
        y: -20,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from('.landing-wrapper', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform',
        })
        .from('.image-hero-wrapper', {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
        .from(
          '.img-hero',
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '<'
        );
    }, mainRef);

    return () => ctx.revert();
  }, [contentReady]);

  return (
    <div className="main-container">
      {showLoader && (
        <div className="loader" style={{ pointerEvents: 'none' }}>
          <Loader onAnimationComplete={handleLoadingComplete} />
        </div>
      )}

      {hasLoaded && (
        <div
          className="main-page"
          ref={mainRef}
          style={{
            opacity: contentReady ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />

          <div className="hamburger-wrapper">
            <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>

          <div className="landing-wrapper">
            <LandingPage />
          </div>

          <div className="image-hero-wrapper">
            <ImageHero />
          </div>

          {animationFinished && (
            <>
              <div className="lazy-section wow-text">
                <React.Suspense fallback={<div>Loading WowText...</div>}>
                  <LazyWowText />
                </React.Suspense>
              </div>

              <div className="lazy-section service">
                <React.Suspense fallback={<div>Loading Service...</div>}>
                  <LazyService />
                </React.Suspense>
              </div>

              <div className="lazy-section get-in-touch">
                <React.Suspense fallback={<div>Loading Get In Touch...</div>}>
                  <LazyGetInTouch />
                </React.Suspense>
              </div>

              <div className="lazy-section testimonials">
                <React.Suspense fallback={<div>Loading Testimonials...</div>}>
                  <LazyTestimonialSlider />
                </React.Suspense>
              </div>

              <div className="lazy-section footer">
                <React.Suspense fallback={<div>Loading Footer...</div>}>
                  <LazyFooter />
                </React.Suspense>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
