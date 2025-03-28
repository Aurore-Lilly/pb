import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import client from '../../contentful/ContentfulClient';
import Hamburger from '../Reusable/Header/Hamburger';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch data from Contentful
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'photographerPortfolio',
        });
        setData(response.items);
      } catch (error) {
        console.error('Error fetching data from Contentful', error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!data) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 868px)", () => {
      const images = gsap.utils.toArray('.img-landing');

      gsap.fromTo(
        images,
        { scale: 1, opacity: 0.9 },
        {
          scale: 1.2,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '.presentation',
            start: 'bottom top',
            end: '+=1000',
            scrub: true,
          },
        }
      );
    });

    return () => mm.revert();
  }, [data]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="landing-page inter">
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <button className={`toggle-button cursive ${isMenuOpen ? 'open' : 'closed'}`} onClick={toggleMenu}>
        {isMenuOpen ? (
          <div className='close-menu'>
            <span className="inter close-text">CLOSE</span>
          </div>
        ) : (
          <div className='open-menu'>
            <span className="inter open-text">MENU</span>
          </div>
        )}
      </button>

      {data?.map((item) => (
        <div key={item.sys.id}>
          <section className='section-hero static'>
            <section className="landing-content">
              <div className='presentation'>
                <h5 className='landing-title'><sup>Pauline</sup> Babin</h5>
                <p className='cursive'>{item.fields.title}</p>
                <mark>
                  <a href="mailto:paulinebabin@gmail.com?subject=Let's Work Together&body=Salut Pauline,%0D%0A%0D%0AJ'aimerais discuter d'un projet avec toi!" target="_blank" rel="noopener noreferrer">
                    paulinebabin@gmail.com
                  </a>
                </mark>
              </div>
            </section>
          </section>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
