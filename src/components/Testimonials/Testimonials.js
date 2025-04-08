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
  const [isPaused, setIsPaused] = useState(false); // Track if the cycle is paused

  const testimonialRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null); // Track interval for clearing when paused

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
        if (isPaused) return; // Don't cycle if paused

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

      // Start cycling testimonials every 5 seconds
      intervalRef.current = setInterval(cycleTestimonials, 5000);

      // Clean up interval on unmount or when paused
      return () => clearInterval(intervalRef.current);
    }
  }, [testimonials, isPaused]);

  // Handle hover and touch events to pause/resume cycling
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  // Intersection Observer to Toggle Class on Body
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("testimonial-in-view", entry.isIntersecting);
      },
      {
        root: null, // Uses viewport
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: "-60% 0px -20% 0px", // Faster removal when scrolling up
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      document.body.classList.remove("testimonial-in-view");
    };
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div
      ref={containerRef}
      className="testimonial-container"
      onMouseEnter={handleMouseEnter} // Pause on hover
      onMouseLeave={handleMouseLeave} // Resume on mouse leave
      onTouchStart={handleTouchStart} // Pause on touch start (mobile)
      onTouchEnd={handleTouchEnd} // Resume on touch end
    >
      {videoUrl && (
        <video className="testimonial-video" autoPlay loop muted playsInline src={videoUrl}></video>
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
