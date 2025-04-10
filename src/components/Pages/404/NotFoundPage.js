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
      <h2>404 Page Not Found 😐</h2>
      <Link to="/" className="back-button">
        ⬅ Back to Main Page
      </Link>
    </div>
  );
};

export default NotFoundPage;