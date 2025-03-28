import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components & Pages
import MainPage from './components/Pages/LandingPage/MainPage';
import NotFoundPage from './components/Pages/404/NotFoundPage';
import Service from './components/Pages/ServicePage/Service';
import ServiceDetail from './components/Pages/ServicePage/ServiceDetail';
import PreviewButton from './components/Preview/PreviewButton';
import PreviewPage from './components/Pages/Preview/PreviewPage';
import CookieConsent from 'react-cookie-consent';
import Portfolio from './components/Pages/PortfolioPage/PortfolioPage';
import Loader from './components/Reusable/Loader/Loader';

const App = () => {
  const [loading, setLoading] = useState(true); // Track loading state
  const [previewMode, setPreviewMode] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);
  const location = useLocation();

  // Check if the loader has already completed
  useEffect(() => {
    const loaderStatus = sessionStorage.getItem('loaderCompleted');

    if (loaderStatus === 'true') {
      setLoading(false); // If loader completed before, skip loader
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('loaderCompleted', 'true'); // Mark loader as completed
      }, 3000); // Reduced loader time to 3 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, []);

  useEffect(() => {
    const isPreview = localStorage.getItem('previewMode') === 'true';
    setPreviewMode(isPreview);

    const consent = localStorage.getItem('cookieConsent');
    setCookieConsent(consent || null);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location.pathname]);

  return (
    <div className="App">
      {/* The main content starts loading in the background while the loader is visible */}
      <div className={`main-content-wrapper ${loading ? 'loading' : 'loaded'}`}>
        <PreviewButton setPreviewMode={setPreviewMode} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/services" element={<Service />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/preview" element={previewMode ? <PreviewPage /> : <MainPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* The loader component is visible only during the loading state */}
      {loading && <Loader />}
      
      {/* Cookie consent handling */}
      {cookieConsent === null && (
        <CookieConsent
          location="bottom"
          cookieName="myWebsiteCookies"
          className="cookie-div"
          style={{
            background: '#fff',
            color: 'var(--black)',
            fontSize: '14px',
            borderTop: '1px solid var(--black)',
          }}
          buttonStyle={{ display: 'none' }}
          expires={150}
        >
          By Clicking on "Accept All", you agree to the storing of cookies on your device to enhance site navigation and analyze site usage.
          <div className='cookie-wrap' style={{ marginTop: '10px' }}>
            <button
              onClick={() => {
                localStorage.setItem('cookieConsent', 'accepted');
                setCookieConsent('accepted');
              }}
              style={{
                backgroundColor: 'var(--red)',
                color: 'var(--white)',
                border: '1px solid var(--hot)',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '0',
                marginRight: '10px',
              }}
            >
              Accept All
            </button>
            <button
              onClick={() => {
                localStorage.setItem('cookieConsent', 'denied');
                setCookieConsent('denied');
              }}
              style={{
                backgroundColor: 'var(--pink)',
                color: 'var(--red)',
                border: '1px solid var(--red)',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '0',
              }}
            >
              Deny All
            </button>
          </div>
        </CookieConsent>
      )}
    </div>
  );
};

export default App;
