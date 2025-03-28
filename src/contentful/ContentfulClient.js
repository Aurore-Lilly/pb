import { createClient } from 'contentful';

// Initialize Contentful Client
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: process.env.REACT_APP_CONTENTFUL_USE_PREVIEW === 'true' 
    ? 'preview.contentful.com' 
    : 'cdn.contentful.com',
});

// Function to fetch entries with `content_type`
export const fetchEntries = async (contentType, isPreview = false) => {
  try {
    // Use preview or published client
    const clientToUse = isPreview 
      ? client 
      : createClient({
          space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
          accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
          host: 'cdn.contentful.com',
        });

    const response = await clientToUse.getEntries({
      content_type: contentType, // ✅ Ensures only relevant data is fetched
    });

    return response.items || []; // ✅ Always return an array
  } catch (error) {
    console.error("Error fetching entries from Contentful:", error);
    return []; // ✅ Prevents `undefined`
  }
};

// Export client for use elsewhere if needed
export default client;
