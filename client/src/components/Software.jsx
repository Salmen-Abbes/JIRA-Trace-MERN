import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import SystemGrid from "../components/SystemGrid.jsx";

// Register the necessary components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Software = ({ data }) => {
    let RequirementTypeTagNameOccurrences = {}
    let priorityTagNameOccurrences = {}
    let assigneeTagNameOccurrences = {}
    if(data){
      ( {
        RequirementTypeTagNameOccurrences,
        priorityTagNameOccurrences,
        assigneeTagNameOccurrences
      } = data)
    }
  

  const pieData = {
    labels: Object.keys(RequirementTypeTagNameOccurrences),
    datasets: [
      {
        data: Object.values(RequirementTypeTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barData = {
    labels: Object.keys(priorityTagNameOccurrences),
    datasets: [
      {
        label: 'Priority',
        data: Object.values(priorityTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barDataaa = {
    labels: Object.keys(assigneeTagNameOccurrences),
    datasets: [
      {
        label: 'Status',
        data: Object.values(assigneeTagNameOccurrences),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    data? (<div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'
      style={{
        height: 800,
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
            <h3>Functional</h3>
            <Pie data={pieData} />
          </div>
          <div style={{ width: '300px', height: '300px' }}>
            <h3>Priority</h3>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Status</h3>
          <Bar data={barDataaa} options={barOptions} />
        </div>
      </div>
    </div>) : (<div>No data found for this Project</div>)
  );
};

export default Software;
