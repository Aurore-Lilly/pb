import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hamburger from './Hamburger';
import './Header.css';
import client from '../../../contentful/ContentfulClient';

const ToggleButton = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
        setLoading(false); // Set loading to false once data fetching is complete
      }
    };

    fetchData();
  }, []);

  return (
    <div className="header landing-page inter">
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <header className={`landing-header ${scrolled ? "scrolled" : ""}`}>
        <div className={`header-wrapper logo ${isMenuOpen ? 'logo-open' : 'logo-closed'}`}>
          {loading ? (
            <h1 className="cursive logo">Loading...</h1> // Show "Loading..." until data is fetched
          ) : error ? (
            <h1 className="cursive logo">Failed to load data</h1> // Error message if there is an error
          ) : data.length > 0 ? (
            data.map((item) => (
              <Link to="/" key={item.sys.id}>
                <h1 className="cursive logo">{item.fields.mainLogo}</h1>
                <p className="cursive">{item.fields.subTitleLogo}</p>
              </Link>
            ))
          ) : (
            <h1 className="cursive logo">No Logo Data Available</h1> // Show this if there is no data
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
