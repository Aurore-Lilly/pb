import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Wow.css"; // Import the CSS file

gsap.registerPlugin(ScrollTrigger);

const WowText = () => {
  const containerRef = useRef(null);
  const circleRefs = useRef([]); // Store multiple refs
  const [isLoaded, setIsLoaded] = useState(false);

  // This useEffect controls the timing of the component rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true); // Trigger after a small delay to let other components render first
    }, 500); // Delay for 500ms before showing the text component
    return () => clearTimeout(timer); // Cleanup if the component unmounts before the timeout
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%", // Trigger when 80% of it is in view
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Loop through each circle image and animate it when in view
    circleRefs.current.forEach((circle) => {
      if (circle && isLoaded) {
        gsap.set(circle, { opacity: 0, scale: 0 });

        ScrollTrigger.create({
          trigger: circle,
          start: "top 85%", // Trigger when it reaches the 85% scroll position
          onEnter: () => {
            gsap.to(circle, {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
            });
            circle.classList.add("visible");
          },
          onLeaveBack: () => {
            gsap.to(circle, {
              opacity: 0,
              scale: 0,
              duration: 0.6,
              ease: "power3.out",
            });
            circle.classList.remove("visible");
          },
        });
      }
    });
  }, [isLoaded]);

  return (
    <div className="layer" ref={containerRef}>
      <div className="layer-title">
        <span className="text">
          <span className="entoure">Photographe </span><em
              ref={(el) => (circleRefs.current[0] = el)}
              className="circle-image"
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/aurore/image/upload/v1652359457/Pauline/image00015_bi9cpx.jpg)",
              }}
            ></em>
          <br />
          <div className="inline">
            <span> de </span>
            <em
              ref={(el) => (circleRefs.current[1] = el)}
              className="circle-image"
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/aurore/image/upload/v1652359466/Pauline/image00002_kqgn41.jpg)",
              }}
            ></em>
            <span className="big"> passion </span>
             
            <span> qui </span>
            <span> raconte </span>
            <br />
          </div>

          <div className="inline">
            <span> votre </span>
            
            <span className="italic"> histoire </span>
            <span> en </span>
<em
              ref={(el) => (circleRefs.current[2] = el)}
              className="circle-image"
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/aurore/image/upload/v1643214986/Pauline/image00026_bqn7tf.jpg)",
              }}
            ></em>
           
          </div>

          <br />

          <div className="inline">
            
          </div>
          <span className="big italic"> images </span>
        </span>
      </div>
    </div>
  );
};

export default WowText;
