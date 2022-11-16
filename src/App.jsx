import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { useState, useEffect } from "react";


function App() {

  const data = [];

  const [dataChart, setDataChart] = useState([]);
  // const [csv, setCsv] = useState();

  function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).trim().split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
      const values = row.trim().split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});

      return el;
    });

    return arr;
  }

  function arrayToCsv() {
    const titleKeys = Object.keys(dataChart[0]);
    const refinedData = [];
    refinedData.push(titleKeys);

    dataChart.forEach(item => {
      refinedData.push(Object.values(item));
    })
    return refinedData.join('\n');
  }

  useEffect(() => {
    fetch(`/test.csv`, {
      method: "GET",
      headers: {
        'content-type': 'text/csv;charset=UTF-8'
      }
    })
      .then(res => res.text())
      .then(data => {
        // setCsv("data:text/csv;charset=utf-8,"+data);
        setDataChart(csvToArray(data));
        console.log(dataChart)
        console.log(data)
      })
  }, []);

  function exportCsv() {
    const csv = arrayToCsv();
    const uri = "data:text/csv;charset=utf-8," + csv;
    var encodedUri = encodeURI(uri);
    window.open(encodedUri);

  };

  return (
    <>
      <button onClick={exportCsv}>
        Export here
      </button>
      <LineChart
        width={1800}
        height={300}
        data={dataChart}
        margin={{
          top: 5,
          right: 30,
          left: 150,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="dados"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </>
  );
}

export default App
