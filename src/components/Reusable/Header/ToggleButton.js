import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hamburger from './Hamburger';
import './Header.css';
import client from '../../../contentful/ContentfulClient';

const ToggleButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const isServicesPage = location.pathname.startsWith('/services');
      const triggerPoint = window.innerHeight * (isServicesPage ? 0.5 : isMobile ? 0.5 : 1.5);
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > triggerPoint) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'photographerPortfolio',
        });

        setData(response.items || []);
      } catch (err) {
        console.error('Error fetching data from Contentful:', err);
        setError('Error fetching content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="header landing-page inter">
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className={`header-wrapper logo ${isMenuOpen ? 'logo-open' : 'logo-closed'}`}>
          {loading ? (
            <h1 className="cursive logo">Loading...</h1>
          ) : error ? (
            <h1 className="cursive logo">Failed to load data</h1>
          ) : data.length > 0 ? (
            data.map((item) => (
              <Link to="/" key={item.sys.id}>
                <h1 className="cursive logo">{item.fields.mainLogo}</h1>
                <p className="cursive">{item.fields.subTitleLogo}</p>
              </Link>
            ))
          ) : (
            <h1 className="cursive logo">No Logo Data Available</h1>
          )}
        </div>
      </header>

      <button className={`toggle-button cursive ${isMenuOpen ? 'open' : 'closed'}`} onClick={toggleMenu}>
        {isMenuOpen ? (
          <div className="close-menu">
            <span className="inter close-text">CLOSE</span>
          </div>
        ) : (
          <div className="open-menu">
            <span className="inter open-text">MENU</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ToggleButton;
