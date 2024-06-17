import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector, useDispatch } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import {
  fetchProjects,
  updateProject,
  setProjectInfo,
} from "../redux/project/project.slice";
const Coverage = () => {
  const dispatch = useDispatch();
  const { projectsList, loading, errors } = useSelector(
    (state) => state.project
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = (event) => {
    const projectId = event.target.value;
    const selectedProject = projectsList.find(
      (project) => project._id === projectId
    );

    setDescription(selectedProject.description);
    dispatch(setProjectInfo(selectedProject));
  };
  return (
    <div style={{
      backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      overflow: 'hidden',
    }}>
      <div className="mt-2 flex flex-col items-center ">
        <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
          <InputLabel id="demo-select-small-label">
            Select A project
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            label="Select A project"
            onChange={handleChange}
          >
            {projectsList.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {description && (<div style={{ textAlign: 'center' }} >
          <h1 className="uppercase text-xl font-bold">Project Description: </h1> {description}
        </div>)}
      </div>
      <div className='px-6 w-full h-screen flex justify-center items-center'
        >
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-5 left-section">

              <h1 > <b> Overall Quality : 55</b> </h1>
              <ProgressBar style={{ height: '40px', width: '50%' }} className="mt-3" >
                <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                <ProgressBar striped variant="danger" now={25} key={3} label={`${25}`} />
              </ProgressBar>

              <div>
                <h2 className="mt-5"> Specification</h2>
                <ProgressBar style={{ width: '50%' }} className="mt-2"  >
                  <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                  <ProgressBar striped variant="danger" now={25} key={3} label={`${25}`} />
                </ProgressBar>

                <h2  > Design</h2>
                <ProgressBar style={{ width: '50%' }} className="mt-2"  >
                  <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                  <ProgressBar striped variant="danger" now={25} key={2} label={`${25}`} />
                </ProgressBar>
                <h2  >Tests</h2>
                <ProgressBar style={{ width: '50%' }} className="mt-2" >
                  <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                  <ProgressBar striped variant="danger" now={25} key={2} label={`${25}`} />
                </ProgressBar>
              </div>
              <div>
                <div>
                  <h1 className="mt-5">  <b> Project Details:</b>  </h1>
                  <p> x documents </p>
                  <p>Size: x </p>
                </div>
                <div>
                  <h1 className="mt-5"> <b> Requirements: </b></h1>
                  <p> x requirement(s) </p>
                  <p> x uncovered requirement(s)</p>
                  <p> x aditional  requirement(s)</p>
                </div>
              </div>
            </div>





            <div className="col-12 col-md-6 right-section">


              <div className="v-shape">
                <div className="left-part"></div>
                <div className="right-part"></div>
              </div>
            </div>




          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;