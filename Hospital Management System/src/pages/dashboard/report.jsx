import React from 'react';
import Report from "./Report/Report";
import createAndDownloadPdf from "./Report/Report";

 // Ensure this path is correct

 export function Reports () {
  return (
    <>
    <div>
      <Report />
      <createAndDownloadPdf />
    </div>
    </>
  );
};

export default Reports;
