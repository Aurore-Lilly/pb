import React, { useState } from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import './NotFoundPage.css';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="notfound">
      <ToggleButton isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="main-404">
        <h2>404 Page Not Found 😐</h2>
        <Link to="/" className="back-button">
          Retour à la page d'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
