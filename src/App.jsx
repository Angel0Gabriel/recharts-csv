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

import _ from "lodash";

import { format, parseISO, subDays } from 'date-fns';
import { useRef } from "react";
// import { da } from 'date-fns/locale';





function App() {

  const [dataChart, setDataChart] = useState([]);
  // const [csv, setCsv] = useState();

  const [opacity, setOpacity] = useState({
    uv: 1,
    dados: 1
  });

  const handleMouseEnter = useCallback(
    (o) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0 });
    },
    [opacity, setOpacity]
  );

  const handleMouseLeave = useCallback(
    (o) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity, setOpacity]
  );

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

  function handleClick(dataKey) {
    if (_.includes(this.state.disabled, dataKey)) {
      this.setState({
        disabled: this.state.disabled.filter(obj => obj !== dataKey)
      });
    } else {
      this.setState({ disabled: this.state.disabled.concat(dataKey) });
    }
  };


  // function handleClick() {
  //   return Legend.addEventListener("click", (e) => {
  //     console.log(e.target);
  //   })

  // }

// const hideSelected = function() {
//     const [selected, setSelected] = useState(null);
//     if (selected.dataKey === 'dados') {
//       setSelected.hide = 'true'
//     }

//     if (selected.dataKey === 'uv') {
//       setSelected.hide = 'true'
//     }

//     return selected;
//   }



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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onClick={(e) => console.log(e.dataKey)}
          // onClick={() => hideSelected}
          
          // (e) => console.log(e)
        /*{if (e.dataKey === 'dados') e.inactive === 'true'}*/
        />
        <Line
          type="monotone"
          dataKey="dados"
          stroke="#8884d8"
          strokeOpacity={opacity.uv}
          // activeDot={{ r: 8 }}
          hide=''
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="#82ca9d"
          strokeOpacity={opacity.dados}
        />
      </LineChart>
    </>
  );
}

export default App
