import React, { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import "./Requirement.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import Customer from "../components/Customer.jsx";
import System from "../components/System.jsx";
import Software from "../components/Software.jsx";
import CustomerGrid from "../components/CustomerGrid.jsx";
import SystemGrid from "../components/SystemGrid.jsx";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import {
  fetchProjects,
  setProjectInfo,
} from "../redux/project/project.slice";

function Requirement() {
  const [showDetails, setShowDetails] = useState(null);
  const [showGrid, setShowGrid] = useState(null);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(false);
  const dispatch = useDispatch();
  const { projectsList, loading, errors } = useSelector(
    (state) => state.project
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = async (event) => {
    const projectId = event.target.value;
    const selectedProject = projectsList.find(
      (project) => project._id === projectId
    );

    setDescription(selectedProject.description);
    dispatch(setProjectInfo(selectedProject));

    setSelected(true);
    try {
      const res = await fetch(`http://localhost:3001/api/results/getResults/${selectedProject.name}`, {
        method: 'GET',
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        console.log(data);
      } else if (res.status === 404) {
        toast.error("Project does not exist");
      }else{
        toast.error(JSON.parse(res.body.message))
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  };

  const handleViewListClick = (component) => {
    if (selected) {
      setShowGrid(component);
      setShowDetails(null);
    }
    else{
      toast.error("You have to select a project first");
    }
  };

  const handleViewResultsClick = (component) => {
    if (selected) {
      setShowDetails(component);
      setShowGrid(null);
    }else{
      toast.error("You have to select a project first");
    }
  };

  return (
    <div className="requirement-container">
      <div className="content-wrapper ">
        <div className="mb-10 flex flex-col items-center ">
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
          
        </div>
        <div className="cards-container">
          <Card
            title="Customer Requirements"
            image="https://abirgharsalli.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10306?size=medium"
            onViewListClick={() => handleViewListClick(<CustomerGrid rows={results?.Customer?.list || null} />)}
            onViewResultsClick={() => handleViewResultsClick(<Customer data={results?.Customer?.graph || null} />)}
          />
          <Card
            title="System Requirements"
            image="https://abirgharsalli.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10313?size=medium"
            onViewListClick={() => handleViewListClick(<SystemGrid rows={results?.System?.list} />)}
            onViewResultsClick={() => handleViewResultsClick(<System data={results?.System?.graph} />)}
          />
          <Card
            title="System Architecture"
            image="https://abirgharsalli.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium"
            onViewListClick={() => handleViewListClick(<SystemGrid rows={results?.Task?.list} />)}
            onViewResultsClick={() => handleViewResultsClick(<System data={results?.Task?.graph} />)}
          />
          <Card
            title="Software Requirements"
            image="https://abirgharsalli.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10321?size=medium"
            onViewListClick={() => handleViewListClick(<SystemGrid rows={results?.Software?.list} />)}
            onViewResultsClick={() => handleViewResultsClick(<Software data={results?.Software?.graph} />)}
          />
        </div>
        <div className="details-container">{showDetails || showGrid}</div>
        
      </div>
    </div>
  );
}

export default Requirement;
