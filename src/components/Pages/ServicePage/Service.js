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
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const scrolled = useScrollChange(100 * window.innerHeight / 100 / 2);

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
      } catch (error) {
        console.error("Error fetching service data:", error);
        setError("Failed to load services. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`service-page ${className}`}>
      <div className='portfolio-container'>
        <Hamburger />    
        <ToggleButton scrolled={scrolled} />
        <ServiceTitle />
      </div>

      {error ? (
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
