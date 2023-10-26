import React, { useState } from "react";
import "./upload.css";
import Papa from "papaparse";
import {utils, writeFile } from "xlsx";
function UploadComponent() {
  const [data, setData] = useState([]);
  const [coldata, setColData] = useState([]);
  const [valuedata, setvalueData] = useState([]);
  // handleImport

  const handleImport = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        const colArray = [];
        const valueArray = [];
        result.data.map((data) => {
          colArray.push(Object.keys(data));
          valueArray.push(Object.values(data));
        });
        setData(result.data);
        setColData(colArray[0]);
        setvalueData(valueArray);
      },
    });
  };

  // handleExport

  const handleExoprt = () => {
    const headings = [["FirstName", "LastName", "DOB", "City"]];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, data, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, "Report.xlsx");
  };
  return (
    <div className="import">
      {/* download template */}
      <div className="download-template">
        <button onClick={handleExoprt}>Download Template</button>
      </div>
      {/* upload template */}
      <div className="button-wrap">
        <label className="button" htmlFor="upload">
          Upload Template
        </label>
        <input id="upload" type="file" accept=".csv" onChange={handleImport} />
      </div>

      {data.length == 0 ? (
        <h4>no data found</h4>
      ) : (
        <div className="data" style={{ marginTop: "2rem" }}>
          <table>
            <thead>
              <tr>
                {coldata.map((d, i) => {
                  return <th key={i}>{d}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {valuedata.map((d, i) => {
                return (
                  <tr key={i}>
                    {d.map((subdata, i) => {
                      return <td key={i}>{subdata}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UploadComponent;
