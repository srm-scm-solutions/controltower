import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';

const PowerBIReport = ({ embedConfig }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="report-style-class"
        getEmbeddedComponent={(embeddedReport) => {
          console.log('Embedded report instance:', embeddedReport);
        }}
      />
    </div>
  );
};

export default PowerBIReport;
