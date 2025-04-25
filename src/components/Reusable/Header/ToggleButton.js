import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import client from '../../../contentful/ContentfulClient';

const ToggleButton = ({ isOpen, toggleMenu }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const isServicesPage = location.pathname.startsWith('/services');
      const triggerPoint = window.innerHeight * (isServicesPage ? 0.5 : isMobile ? 0.5 : 1.5);
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      setScrolled(currentScroll > triggerPoint);
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
        setError('Error fetching content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="header landing-page inter">
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className={`header-wrapper logo ${isOpen ? 'logo-open' : 'logo-closed'}`}>
          {loading ? (
            <h1 className="cursive logo">Loading...</h1>
          ) : error ? (
            <h1 className="cursive logo">Failed to load data</h1>
          ) : data.length > 0 ? (
            data.map((item) => (
              <Link to="/" key={item.sys.id}>
                <h1 className="TheSecretThings logo">{item.fields.mainLogo}</h1>
                <p className="TheSecretThings">{item.fields.subTitleLogo}</p>
              </Link>
            ))
          ) : (
            <h1 className="TheSecretThings logo">No Logo Data Available</h1>
          )}
        </div>
      </header>

      <button className={`toggle-button cursive ${isOpen ? 'open' : 'closed'}`} onClick={toggleMenu}>
        {isOpen ? (
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
