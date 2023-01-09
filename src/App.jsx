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

import { useState, useEffect, useCallback } from "react";

function App() {

  const [dataChart, setDataChart] = useState([]);

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
        // console.log(dataChart)
        // console.log(data)
      })
  }, []);

  function exportCsv() {
    const csv = arrayToCsv();
    const uri = "data:text/csv;charset=utf-8," + csv;
    var encodedUri = encodeURI(uri);
    window.open(encodedUri);

  };

  console.log(dataChart[0])

  const [estadoHide, setEstadoHide] = useState(false);

  function handleState(e) {
    if (e.dataKey) {
      console.log(e)
      setEstadoHide(e.dataKey);
    }
  }

  const teste = ['dados', 'uv']
  const testeColor = ['red', 'blue']

  return (
    <>
      <button onClick={exportCsv}>
        Export here
      </button>
      <LineChart
        width={1800}
        height={450}
        data={dataChart}
        margin={{
          top: 100,
          right: 0,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
        />
        <YAxis />
        <Tooltip />

        <Legend
          onClick={(e) => handleState(e)}

        />

        {
          teste.map((t, i) => {

            let hide = false
            if (t !== estadoHide && estadoHide) {
              hide = true
            }

            return (
              <Line
                key={i}
                type="monotone"
                stroke={testeColor[i]}
                dataKey={t}
                hide={hide}
              />
            )
          })
        }
      </LineChart>
    </>
  );
}

export default App