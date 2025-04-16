import React, { useEffect, useState } from 'react';
import client from '../../../contentful/ContentfulClient';
import { optimizeImage } from '../../../utils/imageUtils'


const ImageCardGallery = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const entries = await client.getEntries({
        content_type: 'portfolioImageCard' ,
      });

      console.log('Full response from Contentful:', entries); // 👈 Full response
    console.log('Only items:', entries.items); // 👈 Array of image cards

      setCards(entries.items);
    };

    fetchData();
  }, []);

  const [selectedGallery, setSelectedGallery] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.sys.id} onClick={() => setSelectedGallery(card.fields.coverImage)}>
            <img
              src={optimizeImage(card.fields.coverImage.fields.file.url, { w: 1200 })}
              alt={card.fields.title}
              className="cursor-pointer rounded shadow"
            />
            <p>{card.fields.title}</p>
          </div>
        ))}
      </div>

      {selectedGallery && (
        <div className="modal">
          <h2>{selectedGallery.fields.title}</h2>
          <div className="flex flex-wrap gap-2">
            {selectedGallery.fields.images.map((img, index) => (
              <img
                key={index}
                src={optimizeImage(img.fields.file.url, { w: 1200 })}
                alt=""
                className="w-32 h-32 object-cover"
              />
            ))}
          </div>
          <button onClick={() => setSelectedGallery(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ImageCardGallery;
