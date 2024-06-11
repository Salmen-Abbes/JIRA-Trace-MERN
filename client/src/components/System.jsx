// CombinedChartComponent.js
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import SystemGrid from "../components/SystemGrid.jsx";
// Register the necessary components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const System = () => {
  const pieData = {
    labels: ['Functional', 'Non-Functional', 'Information'],
    datasets: [
      {
        data: [1, 1, 1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const barData = {
    labels: ['Minor', 'Blocker', 'Critical'],
    datasets: [
      {
        label: 'Severity',
        data: [1, 1, 1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };
  const barDataaa = {
    labels: ['Abir GHARSALLI'],
    datasets: [
      {
        label: 'Severity',
        data: [1],
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
    <div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'
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
          <h3>Assignee</h3>
          <Bar data={barDataaa} options={barOptions} />
        </div>
      </div>
    </div>

  );
};

export default System;