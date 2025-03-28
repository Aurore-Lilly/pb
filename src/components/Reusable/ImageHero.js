import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { fetchEntries } from '../../contentful/ContentfulClient';

const ImageHero = ({ content }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchEntries('photographerPortfolio');
        setData(items);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching data from Contentful', error);
        setError(error);
        setLoading(false); // Even if there's an error, stop loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      // Trigger GSAP animation only after data is fetched and loading is complete
      gsap.from(".image-hero", {
        opacity: 0.8,
        y: 50,
        duration: 1,
        stagger: 0.3,
      });
    }
  }, [data, loading]); // Run this effect once data is fetched and loading is done

  const handleImageLoad = (e) => {
    // Trigger the GSAP animation when an image is loaded
    gsap.from(e.target, {
      opacity: 0.8,
      y: 50,
      duration: 1,
    });
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong.</h2>
        <p>There was an error fetching the data. Please try again later.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="landing-page inter">
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.sys.id}>
            <section className="image-hero">
              <div className="landing-images">
                {item.fields.mainImage && Array.isArray(item.fields.mainImage) ? (
                  item.fields.mainImage.map((image, imgIndex) => (
                    <div key={imgIndex} className={`image-column column-${imgIndex % 3}`}>
                      <div className="image-container">
                        <img
                          className="img-landing"
                          src={image.fields.file.url}
                          alt={item.fields.title}
                          loading="lazy"  // Enable lazy loading for images
                          style={{ maxWidth: '100%', height: 'auto' }}
                          onLoad={handleImageLoad} // Trigger GSAP animation on image load
                        />
                      </div>
                    </div>
                  ))
                ) : item.fields.mainImage ? (
                  <div className="image-container">
                    <img
                      className="img-landing"
                      src={item.fields.mainImage.fields.file.url}
                      alt={item.fields.title}
                      loading="lazy"  // Enable lazy loading for images
                      style={{ maxWidth: '100%', height: 'auto' }}
                      onLoad={handleImageLoad} // Trigger GSAP animation on image load
                    />
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ))
      ) : (
        <div className="no-data">
          <p>No images available</p>
        </div>
      )}
    </div>
  );
};

export default ImageHero;
