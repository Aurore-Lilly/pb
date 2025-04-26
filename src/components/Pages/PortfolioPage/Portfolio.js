import React, { useEffect, useLayoutEffect, useState, useRef, Suspense } from "react";
import { fetchEntries } from "../../../contentful/ContentfulClient";
import gsap from "gsap";
import "./Portfolio.css";
import { optimizeImage } from "../../../utils/imageUtils";

const PortfolioTitle = React.lazy(() => import("./PortfolioTitle"));

const Portfolio = () => {
  const [data, setData] = useState([]);
  const [clickedImages, setClickedImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const galleryRef = useRef(null);
  const fullscreenRef = useRef(null);
  const collageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchEntries("portfolioCard");
        setData(items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform", // Clear transform after the animation is complete
          onComplete: () => {

            gsap.from(".portfolio-item", {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.1,
              delay: 0.2,
            });
          },
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading]);

  const handleImageClick = (images, index) => {
    setClickedImages(images);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (fullscreenRef.current) {
        fullscreenRef.current.classList.add("show-gallery");
        gsap.to(fullscreenRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
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

  // Scroll-triggered collage animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && collageRef.current) {
            gsap.fromTo(
              collageRef.current,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const collageElement = collageRef.current;
    if (collageElement) observer.observe(collageElement);

    return () => {
      if (collageElement) observer.unobserve(collageElement);
    };
  }, []);

  if (loading) return null;

  if (!data.length) {
    return (
      <div className="error-container">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="port-container" ref={containerRef}>
      <Suspense>
        <div className="title-container">
          <PortfolioTitle />
        </div>
      </Suspense>

      <section className="portfolio-collage" ref={collageRef}>
        {data.map((item, index) =>
          (Array.isArray(item.fields.pictures) ? item.fields.pictures : [item.fields.pictures]).map(
            (img, imgIndex) =>
              img?.fields?.file?.url ? (
                <div
                  key={`${item.sys.id}-${imgIndex}`}
                  className={`portfolio-item item-${index % 5}`}
                  onClick={() => handleImageClick(item.fields.pictures, imgIndex)}
                >
                  <span className="num_portfolio cursive">_0{imgIndex + 1}</span>
                  <img
                    src={optimizeImage(img.fields.file.url, { w: 1200 })}
                    alt={item.fields.title || "Project Image"}
                  />
                </div>
              ) : null
          )
        )}
      </section>

      {clickedImages && (
        <div className="fullscreen-gallery" ref={fullscreenRef}>
          <button className="close-gallery" onClick={handleCloseGallery}>
            ×
          </button>
          <div className="gallery-container">
            <div className="image-gallery" ref={galleryRef}>
              {orderedImages.map((img, index) =>
                img?.fields?.file?.url ? (
                  <div key={index} className="image-item">
                    <img src={optimizeImage(img.fields.file.url, { w: 1200 })} alt={`Gallery ${index}`} />
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
