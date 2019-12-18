import React from "react";
import axios from "axios";
import csvParse from "csv-parse/lib/sync";
import BarChartAnimation from "./BarChartAnimation";

const dataUrl = "/data/category-brands.csv";
const numOfBars = 12;
const duration = 250; 
const numOfSlice = 10;
const chartWidth = 1000;
const chartHeight = 450;
const chartPadding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 100
};

function App() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    axios.get(dataUrl).then(resp => {
      const { data: csvString } = resp;
      const nextData = csvParse(csvString)
        .slice(1)
        .map(([date, name, category, value]) => ({
          date,
          name,
          category,
          value: Number(value)
        }));
      setData(nextData);
    });
  }, []);
  if (data.length === 0) {
    return false;
  }
  return <BarChartAnimation
    data={data}
    numOfBars={numOfBars}
    numOfSlice={numOfSlice}
    duration={duration}
    width={chartWidth}
    height={chartHeight}
    padding={chartPadding}
  />;
}

export default App;
