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
        setTimeout(() => {
          setShowLoader(false);
          document.querySelector('.main-page')?.classList.add('main-ready');
        }, 100);
      }
    });
  };

  useLayoutEffect(() => {
    if (showLoader || !mainRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from('.landing-content', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        clearProps: 'all',
      })
        .from('.toggle-button', {
          autoAlpha: 0,
          y: -10,
          duration: 0.5,
          clearProps: 'all',
        }, '-=0.4')
        .from('.hamburger', {
          autoAlpha: 0,
          y: -10,
          duration: 0.5,
          clearProps: 'all',
        }, '-=0.4')
        .from('.image-hero', {
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
    <>
      {/* Loader shown independently */}
      {showLoader && (
        <div
          className="loader"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'auto',
          }}
        >
          <Loader onAnimationComplete={handleLoadingComplete} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`main-page gsap-hidden ${!showLoader ? 'main-ready' : ''}`}
        ref={mainRef}
        style={{
          pointerEvents: showLoader ? 'none' : 'auto',
        }}
      >
        <LandingPage />
        <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <ImageHero />

        <Suspense fallback={<div>Loading WowText...</div>}>
          <LazyWowText />
        </Suspense>

        <Suspense fallback={<div>Loading Service...</div>}>
          <LazyService />
        </Suspense>

        <Suspense fallback={<div>Loading Get In Touch...</div>}>
          <LazyGetInTouch />
        </Suspense>

        <Suspense fallback={<div>Loading Testimonials...</div>}>
          <LazyTestimonialSlider />
        </Suspense>

        <Suspense fallback={<div>Loading Footer...</div>}>
          <LazyFooter />
        </Suspense>
      </div>
    </>
  );
};
export default MainPage;
