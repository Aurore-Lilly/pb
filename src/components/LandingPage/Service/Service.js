import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import client from '../../../contentful/ContentfulClient';

import ServiceTitle from './ServiceTitle';
import Loader from '../../Reusable/Loader/Loader';
import { optimizeImage } from '../../../utils/imageUtils';
import './Service.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Service = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({ content_type: 'serviceCard' });
        setData(response.items || []);
      } catch (err) {
        console.error('Error fetching data from Contentful:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoadingComplete(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  if (!loadingComplete || data.length === 0 || !wrapperRef.current) return;

  const ctx = gsap.context(() => {
    gsap.utils.toArray('.portrait-component').forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, skewY: 5 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1, // subtle stagger on scroll
        }
      );
    });
  }, wrapperRef);

  return () => ctx.revert();
}, [loadingComplete, data]);

 

  if (!loadingComplete) {
    return <Loader onLoadingComplete={() => {}} />;
  }

  return (
    <section className="services" ref={wrapperRef}>
      <ServiceTitle />

      <div className="service-card">
        {error ? (
          <p className="error-text">{error}</p>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <Link
              key={item.sys.id}
              to={`/services/${item.fields.slug}`}
              className="portrait-component"
            >
              <h1 className="cursive image-title">
                <span className="num">_0{index + 1} </span>
                {item.fields.title}
              </h1>

              <div className="portrait-container">
                <div className="background-img">
                  <img
                    src={optimizeImage(item.fields.backgroundImage.fields.file.url, { w: 1200, fm: 'webp' })}
                    alt={item.fields.title}
                    loading="lazy"
                  />
                </div>

                <div className="img-front">
                  <img
                    src={optimizeImage(item.fields.frontImage.fields.file.url, { w: 1200, fm: 'webp' })}
                    alt={item.fields.title}
                    loading="lazy"
                  />
                </div>

                <div className="tag-container">
                  {item.fields.tag?.map((tag, tagIndex) => (
                    <span key={tagIndex} className="inter tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-data">No services available.</p>
        )}
      </div>
    </section>
  );
};

export default Service;
