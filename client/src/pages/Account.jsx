import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/project/project.slice";
import "./acc.css";
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
        <h1 style={{fontWeight:'bold',fontSize:70,textAlign:'center',marginBottom:100}}>Your Projects</h1>
        </div>

      <div className="container text-center">
        {loading && <div>Loading...</div>}
        {errors && <div>Error: {errors}</div>}
        <div className="row justify-content-center ">
          {projectsList.map((project) => (
            <div key={project._id} className="col-md-2 mr-2 mx-3 my-3">
              <div className="card h-100 project-card">
                <div className="card-body">
                  <h5 className="card-title">Project Name:</h5>
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text project-description">Description:</p>
                  <p className="card-text project-description">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
