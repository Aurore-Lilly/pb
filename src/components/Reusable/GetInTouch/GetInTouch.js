import React from 'react'
import HitMeUp from '../../Svg/hello';
import './GetInTouch.css';

const GetInTouch = () => {
  return (
    <section className='contact'>   
        <div className='getInTouch'>
            <h1>Want to work with me?</h1>
            <div className='getintouch-button'>
                <a  href="mailto:paulinebabin@gmail.com?subject=Let's Work Together&body=Salut Pauline,%0D%0A%0D%0AJ'aimerais discuter d'un projet avec toi!"  target="_blank" rel="noopener noreferrer" className="email-link"> 
                <HitMeUp />
                <p className='inter'>email</p>
                </a>
            </div>
        </div>
    </section>
  )
}

export default GetInTouch
