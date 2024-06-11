import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./account.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Account = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/project/getprojects', {
          headers: { authorization: `Bearer ${token}` }
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error.response?.data?.message || error.message);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className='px-6 w-full h-screen flex justify-center items-center'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}>
      <div className="container">
        <h1>Your Projects</h1>
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map(project => (
              <li key={project._id} className="list-group-item">
                <h5>{project.name}</h5>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
