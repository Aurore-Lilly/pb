import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./Testimonials.css";
import client from "../../contentful/ContentfulClient";

const TestimonialSlider = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonialRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch video & testimonials from Contentful
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await client.getEntries({ content_type: "photographerPortfolio" });
        const videoAsset = videoRes.items?.[0]?.fields?.testimonialBackground?.fields?.file?.url;
        setVideoUrl(videoAsset || "");

        const testimonialRes = await client.getEntries({ content_type: "testimonials" });
        const fetchedTestimonials = testimonialRes.items.map((item) => ({
          id: item.sys.id,
          text: item.fields.testimonials,
          author: item.fields.author || "Anonymous",
        }));

        setTestimonials(fetchedTestimonials);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials.");
      }
    };

    fetchData();
  }, []);

  // GSAP Animation for Cycling Testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const cycleTestimonials = () => {
        if (isPaused) return;

        const element = testimonialRef.current;
        if (!element) return;

        gsap.to(element, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          onComplete: () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
            gsap.fromTo(element, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
          },
        });
      };

      intervalRef.current = setInterval(cycleTestimonials, 5000);

      return () => clearInterval(intervalRef.current);
    }
  }, [testimonials, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div
      ref={containerRef}
      className="testimonial-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {videoUrl && (
        <video
          className="testimonial-video"
          autoPlay
          loop
          muted
          playsInline
          src={videoUrl}
        ></video>
      )}
      <div className="overlay"></div>
      <div ref={testimonialRef} className="testimonial-content">
        {testimonials.length > 0 ? (
          <>
            <div className="testimonial-text">
              {documentToReactComponents(testimonials[currentIndex].text)}
            </div>
            <p className="testimonial-author">- {testimonials[currentIndex].author}</p>
          </>
        ) : (
          <p className="no-testimonials">No testimonials available.</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialSlider;
