import React from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import './NotFoundPage.css';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='notfound'>
    <ToggleButton />
    <Hamburger />
      <div className='main-404'>
        <h2>404 Page Not Found 😐</h2>
        <Link to="/" className="back-button">
          Retour à la page d'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;