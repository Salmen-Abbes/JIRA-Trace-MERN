import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import excelFile from "../assets/excel.xls"; // Adjust the path as needed

function App() {
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {
    // Function to process the Excel file
    const processExcelFile = async () => {
      const response = await fetch(excelFile);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    };

    processExcelFile();
  }, []);

  return (
    <div className="wrapper">
      <h3>Report</h3>

      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No Data Available!</div>
        )}
      </div>
    </div>
  );
}

export default App;
