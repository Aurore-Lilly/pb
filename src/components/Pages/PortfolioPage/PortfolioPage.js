import React, { useEffect, useState, useRef, useLayoutEffect, Suspense } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import { useLocation } from 'react-router-dom';
import Loader from '../../Reusable/Loader/Loader';
import gsap from 'gsap';

const LazyPortfolio = React.lazy(() => import('./Portfolio'));
const LazyGetInTouch = React.lazy(() => import('../../Reusable/GetInTouch/GetInTouch'));
const LazyFooter = React.lazy(() => import('../../Reusable/Footer/Footer'));

const PortfolioPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loaderRef = useRef(null);
  const toggleRef = useRef(null);
  const hamburgerRef = useRef(null);
  const headerContainer = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const className =
    location.pathname === "/"
      ? "home-style"
      : location.pathname.includes("/portfolio")
      ? "portfolio-style"
      : "default-style";

  // Animate loader out and reveal header
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        loaderRef.current.classList.add("fade-out");
        setTimeout(() => {
          setIsLoading(false);
          setShowHeader(true);
        }, 500); // match with fade CSS transition
      } else {
        setIsLoading(false);
        setShowHeader(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Animate header, then reveal portfolio content, then footer
  useLayoutEffect(() => {
  if (showHeader) {
    const ctx = gsap.context(() => {
      // Animate both the PortfolioTitle and ToggleButton at the same time
      gsap.fromTo(
        [toggleRef.current, hamburgerRef.current, ".title-container"],
        { opacity: 0, y: -20 }, // Initial state: opacity 0, move up
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          clearProps: "all", // Reset any transform/opacity after the animation
          onComplete: () => {
            setTimeout(() => {
              setShowContent(true);
              setTimeout(() => {
                setShowFooter(true);
              }, 300); // Delay footer after portfolio appears
            }, 100);
          },
        }
      );
    }, headerContainer);

    // Make sure ToggleButton has the correct initial position/color
    // Set initial styles here (in case it's not behaving properly on re-render)
    if (toggleRef.current) {
      toggleRef.current.style.opacity = 1;
      toggleRef.current.style.transform = 'translateY(0)';
    }
    
    return () => ctx.revert();
  }
}, [showHeader]);


  // Optional scroll trigger
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
      {isLoading && (
        <div ref={loaderRef}>
          <Loader />
        </div>
      )}

      {showHeader && (
        <div className="header-components" ref={headerContainer}>
          <div ref={toggleRef}>
            <ToggleButton 
              isOpen={isMenuOpen} 
              toggleMenu={toggleMenu} 
              ref={toggleRef}
            />
          </div>
          <div ref={hamburgerRef}>
            <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      )}

      {showContent && (
        <Suspense fallback={null}>
          <div className="portfolio-container">
            <LazyPortfolio />
          </div>
        </Suspense>
      )}

      {showFooter && (
        <>
          <Suspense fallback={null}>
            <div className="footer-and-contact">
              <LazyGetInTouch />
            </div>
          </Suspense>

          <Suspense fallback={null}>
            <div className="footer-section">
              <LazyFooter />
            </div>
          </Suspense>
        </>
      )}
    </section>
  );
};

export default PortfolioPage;
