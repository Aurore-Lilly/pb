import React, { useEffect, useRef } from 'react';
import HitMeUp from '../../Svg/hello';
import './GetInTouch.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GetInTouch = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const pRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        pRef.current,
        { scale: 0.8, opacity: 0 },
        {
          
          opacity: 1,
          duration: 0.8,
          scale: 1.05,
          ease: 'back.out(1.7)', // playful bounce
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );


      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className='contact' ref={sectionRef}>
      <div className='getInTouch'>
        <h1 ref={titleRef}>On travaille ensemble?</h1>
        <div className='getintouch-button' ref={buttonRef}>
          <a
            href="mailto:paulinebabinpro@gmail.com?subject=Let's Work Together&body=Salut Pauline,%0D%0A%0D%0AJ'aimerais discuter d'un projet avec toi!"
            target="_blank"
            rel="noopener noreferrer"
            className="email-link"
          >
            <HitMeUp />
            <p className='inter' ref={pRef}>email</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
