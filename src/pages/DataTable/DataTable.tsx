// src/pages/SimplePage.tsx
import React from 'react';
import Table from './components/Table/Table'; // Assuming the DataTable component is in the same directory

const DataTable: React.FC = () => {
  return (
    <div style={{ padding:0,minHeight: '100vh' }}>
        <Table />
    </div>
  );
};

export default DataTable;
