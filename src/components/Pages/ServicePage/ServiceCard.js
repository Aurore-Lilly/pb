import React from "react";
import { Link } from "react-router-dom";
import "./ServiceCard.css"; // Separate CSS for service cards

const ServiceCard = ({ service, index }) => {
  return (
    <Link
      to={`${service.fields.slug}`} // Navigates to dynamic service page
      className="portrait-component"
    >
      <h1 className="cursive image-title">
        <span className="num">_0{index + 1}</span>
        {service.fields.title}
      </h1>

      <div className="portrait-container">
        <div className="background-img">
          <img src={service.fields.backgroundImage.fields.file.url} alt={service.fields.title} />
        </div>

        <div className="img-front">
          <img src={service.fields.frontImage.fields.file.url} alt={service.fields.title} />
        </div>

        <div className="tag-container">
          {service.fields.tag?.map((tag, tagIndex) => (
            <span key={tagIndex} className="inter tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
