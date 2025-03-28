import React, { useEffect, useState } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import { useLocation } from 'react-router-dom';
import useScrollChange from '../../../hooks/useScrollChange';
// Import Loader component
import Loader from '../../Reusable/Loader/Loader';
// Lazy load Portfolio for better performance
const LazyPortfolio = React.lazy(() => import('./Portfolio'));

// Lazy load Footer and GetInTouch to load them after the primary content
const LazyGetInTouch = React.lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
const LazyFooter = React.lazy(() => import('../../Reusable/Footer/Footer'));

const PortfolioPage = () => {
  const scrolled = useScrollChange(); // Track scroll state
  const location = useLocation();

  const className = location.pathname === "/"
    ? "home-style"
    : location.pathname.includes("/portfolio")
    ? "portfolio-style"
    : "default-style";

  const [isLoading, setIsLoading] = useState(true); // Track if loading

  // Simulate loading for at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 1 second
    }, 3000); // Adjust this as per your needs

    return () => clearTimeout(timer); // Clean up timeout on unmount
  }, []);

  return (
    <section className={`portfolio-page ${className}`}>
      {/* Render Hamburger and ToggleButton immediately */}
      <div className="header-components">
        <Hamburger />
        <ToggleButton scrolled={scrolled} />
      </div>

      {/* Loader will be shown while the page is loading */}
      {isLoading && <Loader />} {/* Show loader immediately */}

      {/* Only render the Portfolio once it has been lazy-loaded */}
      <React.Suspense fallback={null}>
        <div className="portfolio-container">
          <LazyPortfolio />
        </div>
      </React.Suspense>

      {/* Lazy load GetInTouch and Footer */}
      <React.Suspense fallback={<div>Loading Get In Touch...</div>}>
        <div className="footer-and-contact">
          <LazyGetInTouch />
        </div>
      </React.Suspense>

      <React.Suspense fallback={<div>Loading Footer...</div>}>
        <div className="footer-section">
          <LazyFooter />
        </div>
      </React.Suspense>
    </section>
  );
};

export default PortfolioPage;
