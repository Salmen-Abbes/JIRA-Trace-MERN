import React from 'react';
import './Card.css';

const ProjectCard = ({ title,  content}) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
  
      <p className="card-content">{content}</p>

    </div>
  );
};

export default ProjectCard;
