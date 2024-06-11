// CombinedChartComponent.js
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Customer = () => {
  const pieData = {
    labels: ['Accept', 'reject', 'unclear'],
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
  const barDataa = {
    labels: ['Hardware', 'Software', 'Systems'],
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
    <div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Compliance</h3>
          <Pie data={pieData} />
        </div>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Priority</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
          <h3>Requirement Allocation</h3>
          <Bar data={barDataa} options={barOptions} />
        </div>
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Assignee</h3>
          <Bar data={barDataaa} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Customer;