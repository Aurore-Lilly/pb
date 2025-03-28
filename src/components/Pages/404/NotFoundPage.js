import React from 'react';
import Hamburger from '../../Reusable/Header/Hamburger';
import ToggleButton from '../../Reusable/Header/ToggleButton';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className='notfound'>
    <ToggleButton />
    <Hamburger />
      <h2>404 Page Not Found 😐</h2>
    </div>
  );
};

export default NotFoundPage;