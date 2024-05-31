import React from 'react';
import { CSVLink } from 'react-csv';

const ExportButton = ({ data }) => {
  const headers = [
    { label: 'Column 1', key: 'column1' },
    { label: 'Column 2', key: 'column2' },
    // Add more headers as needed
  ];

  return (
    <CSVLink data={data} headers={headers}>
      Export Data
    </CSVLink>
  );
};

export default ExportButton;
