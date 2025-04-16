import React, { useState, useEffect } from 'react';
import { fetchEntries } from '../../contentful/ContentfulClient';
import { optimizeImage } from '../../utils/imageUtils'


const PreviewContent = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const contentEntries = await fetchEntries(); // Fetch content from Contentful
        setEntries(contentEntries);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Error fetching content');
      }
    };

    getData();
  }, []);

  if (error) return <div>{error}</div>; // Show error message if there's an error

  return (
    <div>
      {entries.length === 0 ? (
        <p>No content available</p>
      ) : (
        entries.map((entry) => (
          <div key={entry.sys.id}>
            <h2>{entry.fields.title}</h2>
            {/* Ensure mainImage and its file are defined before accessing the URL */}
            {entry.fields.mainImage && entry.fields.mainImage.fields && entry.fields.mainImage.fields.file ? (
              <img 
                src={optimizeImage(entry.fields.mainImage.fields.file.url, { w: 1200 })} 
                alt={entry.fields.title} 
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            ) : (
              <p>No image available</p>
            )}
            {/* Render other content if needed */}
          </div>
        ))
      )}
    </div>
  );
};

export default PreviewContent;
