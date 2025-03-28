import React, { useEffect, useState, useRef } from "react";
import { fetchEntries } from "../../../contentful/ContentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import gsap from "gsap";
import "./PortfolioTitle.css";

const PortfolioTitle = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroImageRef = useRef(null);
  const textContainerRef = useRef(null);
  const headingRef = useRef(null);
  const heroBackgroundRef = useRef(null); // Reference for the background

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchEntries("portfolioPage");
        setData(items || []);
        setIsLoaded(true);
      } catch (error) {
        setError("Failed to load portfolio data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoaded || !data.length) return;

    const animationTimeline = gsap.timeline();

    // Start by showing the red background immediately (no animation or a small fade-in)
    if (heroBackgroundRef.current) {
      animationTimeline.fromTo(
        heroBackgroundRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" } // Fade in the background with a short duration
      );
    }

    // After the background has appeared, delay the other animations.
    animationTimeline.to({}, { duration: 0.5 }); // Add a small delay

    // Hero Image Animation
    if (heroImageRef.current) {
      animationTimeline.fromTo(
        heroImageRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
      );
    }

    // Heading Animation
    if (headingRef.current) {
      animationTimeline.fromTo(
        headingRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
      );
    }

    // Subtext Animation
    if (textContainerRef.current) {
      animationTimeline.fromTo(
        textContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }

  }, [isLoaded, data]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong.</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Remove this check to stop rendering the "No portfolio data" message
  // You can either return null or simply render nothing when data is not available.
  if (!data || data.length === 0) return null; // This will render nothing when no data is available

  return (
    <div className="portfolio-title">
      {data.map((item) => (
        <div key={item.sys.id} className="portfolio-title-wrapper">
          <div className="hero-container">
            <h1 ref={headingRef} className="portfolio-heading">
              {item.fields.title}
            </h1>

            {/* Hero background that fades in */}
            <div
              ref={heroBackgroundRef}
              className="hero-background-portfolio"
            >
              <img
                className="hero-portfolio"
                src={item.fields?.titlePicture?.fields?.file?.url}
                alt={item.fields?.title || "Portfolio"}
              />
            </div>

            {/* Subtext */}
            <div ref={textContainerRef} className="portfolio-text-container">
              {item.fields.subtext ? documentToReactComponents(item.fields.subtext) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioTitle;
