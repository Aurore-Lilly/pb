import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import './Hamburger.css';

const Hamburger = ({ isOpen, toggleMenu }) => {
  useEffect(() => {
  if (isOpen) {
    gsap.to('.menu', { clipPath: 'circle(150% at 50% 0%)', duration: 0.4, ease: 'power3.inOut' });
    gsap.to('.menu-content', { opacity: 1, duration: 0.5, ease: 'power3.inOut' });
    gsap.fromTo('.menu-list li', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.2, ease: 'power3.inOut' });
  } else {
    gsap.to('.menu', { clipPath: 'circle(0% at 0% 0%)', duration: 0.1, ease: 'power3.inOut' });
    gsap.to('.menu-content', { opacity: 0, duration: 0.1, ease: 'power3.inOut' });
  }
}, [isOpen]);

  // Function to scroll to top on link click
  const handleLinkClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div className="sliding-menu-container">
      <nav className={`menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <ul className="menu-list">
            <li><Link to="/" onClick={() => { toggleMenu(); handleLinkClick(); }}> HOME <span className="num cursive">01</span></Link></li>
            <li><Link to='/portfolio' onClick={() => { toggleMenu(); handleLinkClick(); }}> PORTFOLIO <span className="num cursive">02</span></Link></li>
            <li><Link to="/services" onClick={() => { toggleMenu(); handleLinkClick(); }}>SERVICES <span className="num cursive">03</span></Link></li>
          </ul>
          <ul className="menu-list">
            <li className="secondary title">EMAIL
              <a className="secondary" href="mailto:paulinebabin@gmail.com?subject=Let's Work Together&body=Salut Pauline,%0D%0A%0D%0AJ'aimerais discuter d'un projet avec toi!" target="_blank" rel="noopener noreferrer">PAULINEBABIN@GMAIL.COM</a>
            </li>
            <li className="secondary title">INSTA
              <a className="secondary" href="https://www.instagram.com/lesclichesdepauline/?hl=en" target="_blank" rel="noopener noreferrer">@LESCLICHESDEPAULINE</a>
            </li>
          </ul>
          <div className="menu-footer">
            <h2 className="menu-footer-text cursive">
              <sup><span className="italic">P</span>auline</sup>
              <span className="second"><span className="italic">B</span>abin</span>
              <span className="contrail str">*</span>
            </h2>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Hamburger;
