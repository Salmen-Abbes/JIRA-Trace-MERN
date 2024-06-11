import React, { useEffect } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from 'react-flow-renderer';
import Legend from "../components/Legend";
import axios from 'axios';
import "./Graphic.css";
import { connect } from 'react-redux';
import { createProject } from '../redux/project/project.slice';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Stakeholder Requirements' }, position: { x: -250, y: 5 }, folder: 'Customer', draggable: false },
  { id: '2', data: { label: 'System Requirement Specification (SYRS)' }, position: { x: -150, y: 100 }, folder: 'System', draggable: false },
  { id: '3', data: { label: 'System Architecture (SYA)' }, position: { x: -50, y: 200 }, folder: 'Task ', draggable: false },
  { id: '4', data: { label: 'Software Requirement Specification (SWRS)' }, position: { x: 50, y: 300 }, folder: 'Software', draggable: false },
  { id: '5', data: { label: 'Software Architecture Design (SWAD)' }, position: { x: 150, y: 400 }, folder: 'SWAD', draggable: false },
  { id: '6', data: { label: 'Software Detailed Design (SWDD)' }, position: { x: 250, y: 500 }, folder: 'SWDD', draggable: false },
  { id: '10', data: { label: 'System Qualification Test Specification' }, position: { x: 1000, y: 100 }, folder: 'SYQTS', draggable: false },
  { id: '11', data: { label: 'System Integration Test Specification' }, position: { x: 900, y: 200 }, folder: 'SYITS', draggable: false },
  { id: '7', data: { label: 'Software Qualification Test Plan (SWQTP)' }, position: { x: 800, y: 300 }, folder: 'SWQTP', draggable: false },
  { id: '8', data: { label: 'Software Integration Test Plan (SWITP)' }, position: { x: 700, y: 400 }, folder: 'SWITP', draggable: false },
  { id: '9', data: { label: 'Software Unit Test Plan (SWUTP)' }, position: { x: 600, y: 500 }, folder: 'SWUTP', draggable: false }
]; 

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e2-3', source: '2', target: '3', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e3-4', source: '3', target: '4', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e4-5', source: '4', target: '5', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e5-6', source: '5', target: '6', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e11-7', source: '11', target: '7', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e8-9', source: '8', target: '9', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e7-8', source: '7', target: '8', type: 'straight', animated: true, label: 'satisfies' },
  { id: 'e10-11', source: '10', target: '11', type: 'straight', animated: true, label: 'satisfies' },

  { id: 'e4-7', source: '4', target: '7', type: 'smoothstep', animated: true, label: 'verifies' },
  { id: 'e5-8', source: '5', target: '8', type: 'smoothstep', animated: true, label: 'verifies' },
  { id: 'e6-9', source: '6', target: '9', type: 'smoothstep', animated: true, label: 'verifies' },
  { id: 'e3-11', source: '3', target: '11', type: 'smoothstep', animated: true, label: 'verifies' },
  { id: 'e2-10', source: '2', target: '10', type: 'smoothstep', animated: true, label: 'verifies' },
];

const Graphic = ({ projectInfo, createProject }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  useEffect(() => {
    if (projectInfo && projectInfo.name) {
      const folderNames = nodes.map(node => node.folder).join(',');
      axios.get(`http://localhost:3001/api/graph/checkFolders/${projectInfo.name}?folders=${folderNames}`)
        .then(response => {
          const updatedNodes = nodes.map(node => {
            const folderStatus = response.data.find(folder => folder.folder === node.folder);
            if (folderStatus && folderStatus.exists) {
              return { ...node, style: { backgroundColor: 'green' } };
            }
            return node;
          });
          setNodes(updatedNodes);
        })
        .catch(error => {
          console.error('Error checking folders:', error);
        });
    }
  }, [projectInfo, nodes, setNodes]);

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex' }}>
        <div
          className="px-4 w-full h-screen flex justify-center items-center"
          style={{
            height: 800,
            backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
          >
            <MiniMap />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
        <Legend />
      </div>
    </ReactFlowProvider>
  );
};

const mapStateToProps = (state) => ({
  projectInfo: state.project.projectInfo,
});

export default connect(mapStateToProps, { createProject })(Graphic);
