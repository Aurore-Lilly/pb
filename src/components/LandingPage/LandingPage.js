import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import client from '../../contentful/ContentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Import Contentful's rich text renderer
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

 

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
    <div className="landing-fade-wrapper">
      {data?.map((item) => (
        <div key={item.sys.id}>
          <section className='section-hero static'>
            <section className="landing-content">
              <div className='presentation'>
                <h5 className='landing-title'>
                  <sup>Pauline</sup> Babin
                </h5>
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
