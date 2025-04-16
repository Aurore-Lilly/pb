import React, { useEffect, useState } from 'react';
import client from '../../../contentful/ContentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import './ServiceTitle.css';
import { optimizeImage } from '../../../utils/imageUtils'


const ServiceTitle = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({ content_type: 'servicePage' });
        setData(response.items[0]);
      } catch (error) {
        console.error('Error fetching data from Contentful', error);
        setError('Error fetching content');
      }
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;

  const richTextDocument = data?.fields?.subtext;

  const options = {
    renderNode: {
      'embedded-entry-block': (node) => (
        <div>Embedded entry: {node.data.target.fields.title}</div>
      ),
    },
  };

  return (
    <div className='service-title-container'>
      <div className="service-title">
        <div className='small-img-wrapper'>
          {data?.fields?.smallPicture && (
            <img
              className='small-img'
              src={optimizeImage(data.fields.smallPicture.fields.file.url, { w: 1200 })}
              alt={data.fields.title}
            />
          )}
        </div>
        <div>
          <div className='line'></div>
        </div>
        <div className='title-content'>
          <h3 className='cursive'>{data?.fields?.title || 'Default Title'}</h3>
          {richTextDocument ? (
            <div className='title-text'>{documentToReactComponents(richTextDocument, options)}</div>
          ) : (
            <p>No rich text available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;
