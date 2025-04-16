import React, { useEffect, useState } from 'react';
import client from '../../../contentful/ContentfulClient';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import './Service.css';
import ServiceTitle from '../../LandingPage/Service/ServiceTitle';
import { useLocation } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import useScrollChange from '../../../hooks/useScrollChange';
import Footer from '../../Reusable/Footer/Footer';
import GetInTouch from '../../Reusable/GetInTouch/GetInTouch';

const ServicePage = () => {
  const [data, setData]     = useState([]);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(true);          // ← loading state
  const location = useLocation();
  const scrolled = useScrollChange(window.innerHeight * 0.5);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const className = location.pathname === '/' 
    ? 'home-style' 
    : location.pathname.includes('/services') 
      ? 'services-style' 
      : 'default-style';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({ content_type: 'serviceCard' });
        setData(response.items || []);
      } catch (err) {
        console.error("Error fetching service data:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);                             // ← turn off loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`service-page ${className}`}>
      <div className='portfolio-container'>
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />    
        <ToggleButton scrolled={scrolled} isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <ServiceTitle />
      </div>

      {loading ? (
        <div className="loading-container">
          <h2>Loading services…</h2>
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className='services-cards-container'>
          {data.map((item, index) => (
            <ServiceCard key={item.sys.id} service={item} index={index} />
          ))}
        </div>
      )}

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default ServicePage;
