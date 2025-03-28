import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import client from '../../../contentful/ContentfulClient';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import './ServiceDetail.css';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Footer from '../../Reusable/Footer/Footer';
import ScrollToTop from '../../Reusable/ScrollToTop/ScrollToTop';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const { pathname } = useLocation();

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Fetch service details based on the slug
  useEffect(() => {
    if (!slug) return;

    const fetchServices = async () => {
      try {
        const response = await client.getEntries({ content_type: 'serviceCard' });

        if (response.items.length > 0) {
          setServices(response.items);
          const currentService = response.items.find((item) => item.fields.slug === slug);
          setService(currentService || null);
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again later.');
      }
    };

    fetchServices();
  }, [slug]);

  // Handle image gallery animation with GSAP
  useEffect(() => {
    if (!service?.fields?.pictureGallery?.length) return;

    const images = document.querySelectorAll('.flip-gallery img');
    if (images.length === 0) return;

    gsap.set(images, { opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' });

    let tl = gsap.timeline({ repeat: -1 });
    images.forEach((image) => {
      tl.to(image, { opacity: 1, duration: 1 })
        .to(image, { opacity: 0, duration: 1 }, '+=1.5');
    });
  }, [service]);

  // Error handling for failed service fetch
  if (error) return <div className="error-text">{error}</div>;

  // Return a message if the service data is not yet fetched
  if (!service) return <div>Loading...</div>;

  // Options for rendering rich text content
  const options = {
    renderNode: {
      'paragraph': (node, children) => <p className="rich-text-paragraph">{children}</p>,
      'embedded-entry-block': (node) => {
        return <div>Embedded entry: {node.data?.target?.fields?.title || 'Untitled'}</div>;
      },
    },
  };

  return (
    <section className="service-detail">
      <Hamburger />
      <ToggleButton />

      <div className="service-layout">
        <div className="detail-hero">
          <img
            src={service?.fields?.frontImage?.fields?.file?.url}
            alt={service?.fields?.title || 'Service Image'}
            className="hero-image"
          />
          <h1 className="cursive detail-title">{service?.fields?.title}</h1>
        </div>

        <div className="gallery-list-container">
          <div className="first-el">
            {service?.fields?.backgroundImage && (
              <div className="small-picture">
                <img
                  src={service.fields.backgroundImage.fields.file.url}
                  alt={service.fields.title}
                  className="small-photo"
                />
              </div>
            )}
          </div>
          <div className="second-el">
            <div className="service-list">
              {service.fields.subtext ? (
                <div className="rich-text-container">
                  {documentToReactComponents(service.fields.description, options)}
                </div>
              ) : (
                <p>No rich text available</p>
              )}
              <div className="wrapper">
                {service?.fields?.list?.map((list, listIndex) => (
                  <li key={listIndex} className="inter tag">{list}</li>
                ))}
              </div>
            </div>
            <div className="star"><h3>*</h3></div>
          </div>
        </div>

        <div className="flip-gallery">
          {service?.fields?.pictureGallery?.map((image, imgIndex) => (
            <img key={imgIndex} src={image.fields.file.url} alt={image.fields.title} />
          ))}
        </div>

        <div className="other-services">
          <p className="inter other-service">Autres services:</p>
          <ul>
            {services
              .filter((s) => s.fields.slug !== slug)
              .map((s) => (
                <li className="tag" key={s.fields.slug}>
                  <Link to={`/services/${s.fields.slug}`} className="link-with-arrow">
                    {s.fields.title} <span className="arrow-icon">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </section>
  );
};

export default ServiceDetail;
