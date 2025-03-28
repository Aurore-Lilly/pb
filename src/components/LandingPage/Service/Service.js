import React, { useEffect, useState } from 'react';
import client from '../../../contentful/ContentfulClient';
import './Service.css'; 
import { Link } from 'react-router-dom'; 
import ServiceTitle from './ServiceTitle';

const Service = () => { 
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({ content_type: 'serviceCard' });
        setData(response.items);
      } catch (err) {
        console.error('Error fetching data from Contentful:', err);
        setError('Failed to load services. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <section className="services">
      <ServiceTitle />
      <div className="service-card">
        {error ? (
          <p className="error-text">{error}</p>
        ) : (
          data.length > 0 ? (
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
                      src={item.fields.backgroundImage.fields.file.url}
                      alt={item.fields.title}
                    />
                  </div>
                  <div className="img-front">
                    <img
                      src={item.fields.frontImage.fields.file.url}
                      alt={item.fields.title}
                    />
                  </div>

                  <div className="tag-container">
                    {item.fields.tag &&
                      item.fields.tag.map((tag, tagIndex) => (
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
          )
        )}
      </div>
    </section>
  );
};

export default Service;
