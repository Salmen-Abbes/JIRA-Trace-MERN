import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/project/project.slice";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Account.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const dispatch = useDispatch();
  const { projectsList, loading, errors } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div
      className="d-flex flex-column align-items-center vh-100"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <div>
        <h1 className="projects-title">
          Your Projects
        </h1>
      </div>

      <div className="cards-container container">
        {loading && <div>Loading...</div>}
        {errors && <div>Error: {errors}</div>}
        <div className="row justify-content-center">
          {projectsList.map((project) => (
            <div key={project._id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center">
              <ProjectCard
                title={project.name}
                content={project.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
