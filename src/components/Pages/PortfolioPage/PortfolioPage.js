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
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const className = location.pathname === "/"
    ? "home-style"
    : location.pathname.includes("/portfolio")
    ? "portfolio-style"
    : "default-style";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const triggerPoint = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setScrolled(scrollTop > triggerPoint);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`portfolio-page ${className} ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-components">
        <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
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
