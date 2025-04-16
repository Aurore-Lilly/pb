export const optimizeImage = (url, options = {}) => {
  const params = new URLSearchParams({
    fm: 'webp',
    q: '80',
    ...options, // allow override or add options like width, height
  });

  return `${url}?${params.toString()}`;
};
