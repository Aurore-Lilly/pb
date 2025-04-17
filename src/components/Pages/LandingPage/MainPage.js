import React, { useState, useLayoutEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ToggleButton from '../../Reusable/Header/ToggleButton';
import Hamburger from '../../Reusable/Header/Hamburger';
import ImageHero from '../../Reusable/ImageHero';
import Loader from '../../Reusable/Loader/Loader';
import LandingPage from '../../LandingPage/LandingPage';

const LazyWowText = lazy(() => import("../../LandingPage/Wow"));
const LazyService = lazy(() => import('../../LandingPage/Service/Service'));
const LazyGetInTouch = lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
const LazyFooter = lazy(() => import('../../Reusable/Footer/Footer'));
const LazyTestimonialSlider = lazy(() => import('../../Testimonials/Testimonials'));

gsap.registerPlugin(ScrollTrigger);

const MainPage = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleLoadingComplete = () => {
    gsap.to('.loader', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        setShowLoader(false);
      }
    });
  };

  // ✅ This runs every time the component mounts
  useLayoutEffect(() => {
  if (showLoader || !mainRef.current) return;

  const ctx = gsap.context(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.set('.main-page', { visibility: 'visible' }) // ← reveals without layout jump
    tl.to('.main-page', {
      opacity: 1,
      visibility: 'visible',
      duration: 0.3,
      onStart: () => {
        document.querySelector('.main-page')?.classList.remove('gsap-hidden');
      }
    })
      .from('.landing-wrapper', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        clearProps: 'all',
      })
      .from('.toggle-wrapper', {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        clearProps: 'all',
      }, '-=0.4')
      .from('.hamburger-wrapper', {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        clearProps: 'all',
      }, '-=0.4')
      .from('.image-hero-wrapper', {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'all',
      }, '-=0.2');
  }, mainRef);

  return () => ctx.revert();
}, [showLoader]);

  return (
  <div className="main-container">
    {/* Loader */}
    <div
      className="loader"
      style={{
        pointerEvents: showLoader ? 'auto' : 'none',
        opacity: showLoader ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <Loader onAnimationComplete={handleLoadingComplete} />
    </div>

    {/* Main Content */}
    <div
      className="main-page gsap-hidden"
      ref={mainRef}
      style={{
        pointerEvents: showLoader ? 'none' : 'auto',
      }}
    >
      <div className="landing-wrapper">
        <LandingPage />
      </div>

      <div className="toggle-wrapper">
        <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className="hamburger-wrapper">
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className="image-hero-wrapper">
        <ImageHero />
      </div>

      <div className="lazy-section wow-text">
        <Suspense fallback={<div>Loading WowText...</div>}>
          <LazyWowText />
        </Suspense>
      </div>

      <div className="lazy-section service">
        <Suspense fallback={<div>Loading Service...</div>}>
          <LazyService />
        </Suspense>
      </div>

      <div className="lazy-section get-in-touch">
        <Suspense fallback={<div>Loading Get In Touch...</div>}>
          <LazyGetInTouch />
        </Suspense>
      </div>

      <div className="lazy-section testimonials">
        <Suspense fallback={<div>Loading Testimonials...</div>}>
          <LazyTestimonialSlider />
        </Suspense>
      </div>

      <div className="lazy-section footer">
        <Suspense fallback={<div>Loading Footer...</div>}>
          <LazyFooter />
        </Suspense>
      </div>
    </div>
  </div>
);
};

export default MainPage;
