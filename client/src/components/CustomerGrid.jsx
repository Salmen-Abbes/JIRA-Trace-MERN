import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const CustomerGrid = () => {
  const [rows, setRows] = useState([
    {
      id: 10046,
      summary: 'bhhby',
      description: 'fgvbhnj',
      projectName: 'PFE',
      createdBy: 'Abir Gharsalli',
      createdTime: '2024-05-28T22:48:24.285+0100',
      issueType: 'Customer',
      assignee: 'Abir Gharsalli',
      LinkedIssues: 'derives PFE-46',
      priority: 'Blocker',
      customerDocumentName: 'fvg',
      customerDocumentVersion: 'g hbtn',
      customerDocumentReference: 'crvt',
      requirementAllocation: 'Software',
      compliance: 'Accept with comment',
      status: 'customer requirement review',
      release: 're',
    },
    {
      id: 10042,
      summary: 'tt',
      description: 'vfgbhnj',
      projectName: 'PFE',
      createdBy: 'Abir Gharsalli',
      createdTime: '2024-05-27T00:32:32.935+0100',
      issueType: 'Customer',
      assignee: 'Abir Gharsalli',
      LinkedIssues: 'blocks PFE-22',
      priority: 'Critical',
      customerDocumentName: 'ghj',
      customerDocumentVersion: 'vgbhnj',
      customerDocumentReference: 'ygbhn',
      requirementAllocation: 'Software',
      compliance: 'Accept',
      status: 'Open',
      release: '',
    },
    {
      id: 10041,
      summary: 'test customer',
      description: 'test',
      projectName: 'PFE',
      createdBy: 'Abir Gharsalli',
      createdTime: '2024-05-26T21:50:49.573+0100',
      issueType: 'Customer',
      assignee: 'Abir Gharsalli',
      LinkedIssues: 'blocks PFE-13',
      priority: 'Blocker',
      customerDocumentName: 'xxxx',
      customerDocumentVersion: 'xxxx',
      customerDocumentReference: 'xxxxx',
      requirementAllocation: 'Hardware',
      compliance: 'Accept',
      status: 'Open',
      release: '',
    },
  ]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'summary', headerName: 'Summary', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'projectName', headerName: 'Project Name', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdTime', headerName: 'Created Time', width: 180 },
    { field: 'issueType', headerName: 'Issue Type', width: 130 },
    { field: 'assignee', headerName: 'Assignee', width: 130 },
    { field: 'LinkedIssues', headerName: 'Linked Issues', width: 130 },
    { field: 'priority', headerName: 'Priority', width: 130 },
    { field: 'customerDocumentName', headerName: 'Document Name', width: 150 },
    { field: 'customerDocumentVersion', headerName: 'Document Version', width: 150 },
    { field: 'customerDocumentReference', headerName: 'Document Reference', width: 150 },
    { field: 'requirementAllocation', headerName: 'Requirement Allocation', width: 150 },
    { field: 'compliance', headerName: 'Compliance', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'release', headerName: 'Release', width: 130 },
  ];

  const getRowClassName = (params) => {
    if (params.rowIndex === 0) {
      return 'header-row';
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowClassName={getRowClassName}
        sx={{
          '.header-row': {
            backgroundColor: '#0097a7', // or any other teal color you prefer
            color: '#ffffff', // or any other text color you prefer
          },
        }}
      />
    </div>
  );
};

export default CustomerGrid;