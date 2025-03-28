import React, { useState, useEffect } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import LandingPage from '../../LandingPage/LandingPage';
import ImageHero from '../../Reusable/ImageHero';
import Service from '../../LandingPage/Service/Service';
import GetInTouch from '../../Reusable/GetInTouch/GetInTouch';
import Footer from '../../Reusable/Footer/Footer';
import { fetchEntries } from '../../../contentful/ContentfulClient'; // Ensure you have your contentful client set up
import Loader from '../../Reusable/Loader/Loader';

const PreviewPage = () => {
  const [previewData, setPreviewData] = useState(null); // State to hold the fetched preview data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // UseEffect to fetch preview content from Contentful
  useEffect(() => {
    const fetchPreviewContent = async () => {
      try {
        const data = await fetchEntries(true); // Fetch preview content from Contentful
        setPreviewData(data); // Set the preview data into state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching preview content:', err);
        setError('Error fetching preview content');
        setLoading(false);
      }
    };

    fetchPreviewContent();
  }, []); // Runs once on component mount

  // Show a loading indicator while fetching content
  if (loading) return <Loader />;
  
  // Show error if there was a problem fetching the content
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Hamburger />
      <LandingPage />
      <ToggleButton />
      
      {/* Use preview data in components */}
      <ImageHero content={previewData} />
      <Service content={previewData} />
      <GetInTouch content={previewData} />
      
      <Footer />
    </div>
  );
};

export default PreviewPage;
