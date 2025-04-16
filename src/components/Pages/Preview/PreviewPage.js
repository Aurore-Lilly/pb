import React, { useState, useEffect } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import LandingPage from '../../LandingPage/LandingPage';
import ImageHero from '../../Reusable/ImageHero';
import Service from '../../LandingPage/Service/Service';
import GetInTouch from '../../Reusable/GetInTouch/GetInTouch';
import Footer from '../../Reusable/Footer/Footer';
import { fetchEntries } from '../../../contentful/ContentfulClient';
import Loader from '../../Reusable/Loader/Loader';

const PreviewPage = () => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    const fetchPreviewContent = async () => {
      try {
        const data = await fetchEntries(true); // Pass preview mode = true
        setPreviewData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching preview content:', err);
        setError('Error fetching preview content');
        setLoading(false);
      }
    };

    fetchPreviewContent();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="preview-page">
      <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="preview-landing">
        <LandingPage />
      </div>

      <div className="preview-image-hero">
        <ImageHero content={previewData} />
      </div>

      <div className="preview-service">
        <Service content={previewData} />
      </div>

      <div className="preview-contact">
        <GetInTouch content={previewData} />
      </div>

      <div className="preview-footer">
        <Footer />
      </div>
    </div>
  );
};

export default PreviewPage;
