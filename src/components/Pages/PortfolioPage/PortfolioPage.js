import React, { useEffect, useState } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import { useLocation } from 'react-router-dom';
import Loader from '../../Reusable/Loader/Loader';

const LazyPortfolio = React.lazy(() => import('./Portfolio'));
const LazyGetInTouch = React.lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
const LazyFooter = React.lazy(() => import('../../Reusable/Footer/Footer'));

const PortfolioPage = () => {
  const location = useLocation();

  const className = location.pathname === "/"
    ? "home-style"
    : location.pathname.includes("/portfolio")
    ? "portfolio-style"
    : "default-style";

  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Show loader briefly on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Detect scroll past 100vh accurately
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const triggerPoint = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setScrolled(scrollTop > triggerPoint);
      });
    };

    // Run once on mount in case user is already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`portfolio-page ${className} ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-components">
        <Hamburger />
        <ToggleButton />
      </div>

      {isLoading && <Loader />}

      <React.Suspense fallback={null}>
        <div className="portfolio-container">
          <LazyPortfolio />
        </div>
      </React.Suspense>

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
