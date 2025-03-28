import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./ScrollToTop.css";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls past 200px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top with GSAP animation
  const scrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: { y: 0, ease: "power2.inOut" } });
  };

  return (
   <div className="scroll">
   <button
      className={`scroll-to-top ${isVisible ? "show" : "hide"}`}
      onClick={scrollToTop}
    >
      
      <p>Scroll to top</p> {/* Text */}
      <span>↑</span> {/* Arrow */}
    </button>
    </div>
  );
};

export default ScrollToTop;
