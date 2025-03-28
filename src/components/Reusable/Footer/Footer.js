import React from 'react';
import './Footer.css';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-top">
        <ul className="footer-nav email">
          <li>
            <a
              className="tag link-with-arrow"
              href="mailto:paulinebabin@gmail.com?subject=Let's Work Together&body=Salut Pauline,%0D%0A%0D%0AJ'aimerais discuter d'un projet avec toi!"
              target="_blank"
              rel="noopener noreferrer"
            >
              PAULINEBABIN@GMAIL.COM <span className="arrow-icon">→</span>
            </a>
          </li>
        </ul>

        <ul className="footer-nav socials">
          <li>
            <a
              className="tag link-with-arrow"
              href="https://www.instagram.com/lesclichesdepauline/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              @LESCLICHESDEPAULINE <span className="arrow-icon">→</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        
        <div className="design-cred">
          <h1>design by Rory</h1>
        </div>
        <div>
        <ScrollToTop />
        </div>
      </div>
    </section>
  );
};

export default Footer;
