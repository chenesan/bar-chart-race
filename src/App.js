import React from "react";
import axios from "axios";
import csvParse from "csv-parse/lib/sync";
import BarChartAnimation from "./BarChartAnimation";

const dataUrl = "/data/category-brands.csv";

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
  return <BarChartAnimation data={data} />;
}

export default App;
