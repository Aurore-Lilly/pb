import React, { useEffect, useState, useRef } from 'react';
import client from '../../../contentful/ContentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { optimizeImage } from '../../../utils/imageUtils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServiceTitle.css';

gsap.registerPlugin(ScrollTrigger);

const ServiceTitle = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const titleRef = useRef(null); // 👈 Title
  const textRef = useRef(null); // 👈 Subtitle
  const wrapperRef = useRef(null); // 👈 Container

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

  useEffect(() => {
    if (!data) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [data]);

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
    <div className='service-title-container' ref={wrapperRef}>
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
        <div><div className='line'></div></div>
        <div className='title-content'>
          <h3 className='TheSecretThings' ref={titleRef}>
            {data?.fields?.title || 'Default Title'}
          </h3>
          {richTextDocument ? (
            <div className='title-text' ref={textRef}>
              {documentToReactComponents(richTextDocument, options)}
            </div>
          ) : (
            <p>No rich text available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;
