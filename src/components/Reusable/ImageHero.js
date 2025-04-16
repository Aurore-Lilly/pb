import React, { useEffect, useState } from 'react';
import { fetchEntries } from '../../contentful/ContentfulClient';
import { optimizeImage } from '../../utils/imageUtils';

const ImageHero = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchEntries('photographerPortfolio');
        setData(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from Contentful', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                      <div className="image-container img-hero">
                        <img
                          className="img-landing img-hero"
                          src={optimizeImage(image.fields.file.url, { w: 1200 })}
                          alt={item.fields.title}
                          loading="lazy"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                    </div>
                  ))
                ) : item.fields.mainImage ? (
                  <div className="image-container">
                    <img
                      className="img-landing"
                      src={optimizeImage(item.fields.mainImage.fields.file.url, { w: 1200 })}
                      alt={item.fields.title}
                      loading="lazy"
                      style={{ maxWidth: '100%', height: 'auto' }}
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