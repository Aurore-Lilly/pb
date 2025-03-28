import React, { useEffect, useState, useRef } from "react";
import { fetchEntries } from "../../../contentful/ContentfulClient";
import gsap from "gsap";
import "./Portfolio.css";

// Lazy load PortfolioTitle to ensure it loads first
const PortfolioTitle = React.lazy(() => import("./PortfolioTitle"));

const Portfolio = () => {
  const [data, setData] = useState([]);
  const [clickedImages, setClickedImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef(null);
  const fullscreenRef = useRef(null);
  const collageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchEntries("portfolioCard");
        setData(items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = (images, index) => {
    setClickedImages(images);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (fullscreenRef.current) {
        fullscreenRef.current.classList.add("show-gallery");
        gsap.to(fullscreenRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
      }
    }, 100);
  };

  const handleCloseGallery = () => {
    if (fullscreenRef.current) {
      gsap.to(fullscreenRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          fullscreenRef.current.classList.remove("show-gallery");
          setClickedImages(null);
          document.body.style.overflow = "auto";
        },
      });
    }
  };

  const orderedImages = clickedImages
    ? [...clickedImages.slice(currentImageIndex), ...clickedImages.slice(0, currentImageIndex)]
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            collageRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const collageElement = collageRef.current;
    if (collageElement) observer.observe(collageElement);

    return () => {
      if (collageElement) observer.unobserve(collageElement);
    };
  }, []);

  if (!data.length) return <div className="error-container"><p>No data available</p></div>;

  return (
    <div className="portfolio-container">
      {/* Lazy load PortfolioTitle and show a fallback while it's loading */}
      <React.Suspense fallback={<div>Loading Portfolio Title...</div>}>
        <div className="title-container">
          <PortfolioTitle />
        </div>
      </React.Suspense>

      <section className="portfolio-collage" ref={collageRef}>
        {data.map((item, index) =>
          (Array.isArray(item.fields.pictures) ? item.fields.pictures : [item.fields.pictures])
            .map((img, imgIndex) =>
              img?.fields?.file?.url ? (
                <div
                  key={`${item.sys.id}-${imgIndex}`}
                  className={`portfolio-item item-${index % 5}`}
                  onClick={() => handleImageClick(item.fields.pictures, imgIndex)}
                >
                  <span className="num_portfolio cursive">_0{imgIndex + 1}</span>
                  <img src={img.fields.file.url} alt={item.fields.title || "Project Image"} />
                </div>
              ) : null
            )
        )}
      </section>

      {clickedImages && (
        <div className="fullscreen-gallery" ref={fullscreenRef}>
          <button className="close-gallery" onClick={handleCloseGallery}>×</button>
          <div className="gallery-container">
            <div className="image-gallery" ref={galleryRef}>
              {orderedImages.map((img, index) =>
                img?.fields?.file?.url ? (
                  <div key={index} className="image-item">
                    <img src={img.fields.file.url} alt={`Gallery ${index}`} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
