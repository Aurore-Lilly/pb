import React, { useEffect, useState, useRef } from 'react';
import client from '../../contentful/ContentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import './LandingPage.css';
import { gsap } from 'gsap';

const LandingPage = ({ onLoadComplete }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const presentationRef = useRef(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await client.getEntries({
        content_type: 'photographerPortfolio',
      });
      setData(response.items);
      if (onLoadComplete) onLoadComplete(); // tell MainPage we're done
    } catch (error) {
      console.error('Error fetching LandingPage data', error);
      setError(error);
    }
  };

  fetchData();
}, [onLoadComplete]); // ✅ include it here

  useEffect(() => {
    if (presentationRef.current) {
      gsap.fromTo(
        presentationRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.4,
        }
      );
    }
  }, [data]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="landing-page inter">
      <div className="landing-fade-wrapper">
        {data?.map((item) => (
          <div key={item.sys.id}>
            <section className='section-hero static'>
              <section className="landing-content">
                <div className='presentation' ref={presentationRef}>
                  <h5 className='landing-title'><sup>Pauline</sup> Babin</h5>
                  <p className='cursive'>
                    {item.fields.title && documentToReactComponents(item.fields.titleDescription)}
                  </p>
                </div>
              </section>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
