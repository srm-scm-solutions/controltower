import React from 'react';

const PublicReport = () => {
  const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=459da35c-53d4-495e-b516-1712f7b3fc0c&autoAuth=true&ctid=97f7fcbd-e642-4be8-b84f-fc2cd7f8d6ff&navContentPaneEnabled=false&filterPaneEnabled=false"; // Add parameters to disable navigation pane and filter pane

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        title="Public Power BI Report"
        width="100%"
        height="100%"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default PublicReport;
