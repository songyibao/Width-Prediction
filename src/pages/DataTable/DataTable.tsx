// src/pages/SimplePage.tsx
import React from 'react';
import Table from './components/Table/Table'; // Assuming the DataTable component is in the same directory

const DataTable: React.FC = () => {
  return (
    <div style={{ padding:10,minHeight: '100vh',backgroundColor:"white",border: "1px solid #e0e0e0" }}>
        <Table />
    </div>
  );
};

export default DataTable;
