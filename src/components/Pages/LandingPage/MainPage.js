import React, { useState } from 'react';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import LandingPage from '../../LandingPage/LandingPage';
import Hamburger from '../../Reusable/Header/Hamburger';
import ImageHero from '../../Reusable/ImageHero';
import Loader from '../../Reusable/Loader/Loader';  // Importing Loader

const MainPage = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // This function will be called by the loader once loading is done
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Lazy load non-essential components to improve initial load performance
  const LazyWowText = React.lazy(() => import("../../LandingPage/Wow"));
  const LazyService = React.lazy(() => import('../../LandingPage/Service/Service'));
  const LazyGetInTouch = React.lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
  const LazyFooter = React.lazy(() => import('../../Reusable/Footer/Footer'));
  const LazyTestimonialSlider = React.lazy(() => import('../../Testimonials/Testimonials'));

  return (
    <>
      {/* Pass handleLoadingComplete as onLoadingComplete prop */}
      {!loadingComplete && <Loader onLoadingComplete={handleLoadingComplete} />}
      {loadingComplete && (
        <div className="main-page">
          {/* Always render above-the-fold content immediately */}
          <ToggleButton />
          <LandingPage />
          <Hamburger />
          <ImageHero />

          {/* Ensure WowText is rendered only after the page has fully loaded */}
          <React.Suspense fallback={<div>Loading WowText...</div>}>
            <LazyWowText />
          </React.Suspense>

          {/* Trigger lazy loading of other components */}
          <React.Suspense fallback={<div>Loading Service...</div>}>
            <LazyService />
          </React.Suspense>
          <React.Suspense fallback={<div>Loading Get In Touch...</div>}>
            <LazyGetInTouch />
          </React.Suspense>
          <React.Suspense fallback={<div>Loading Testimonials...</div>}>
            <LazyTestimonialSlider />
          </React.Suspense>
          <React.Suspense fallback={<div>Loading Footer...</div>}>
            <LazyFooter />
          </React.Suspense>
        </div>
      )}
    </>
  );
};

export default MainPage;
